import React, {Component} from "react";
import {Query} from "react-apollo";
import {Button, Icon} from "antd";
import {GET_AUTH, GET_USER} from "../query";
import {
    getMessages,
    sendMessageUserToSeller,
    getMessagesFromUser,
    sendMessageUserToUser,
    checkIntialized
} from "../../push-notification";
import gql from "graphql-tag";
import {withApollo} from 'react-apollo';

let userData;

class Demo extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            sellername: "",
            messageList: [],
            message: "",
            isUser: true,
            unread: {},
            unreadUser: {}
        };
    }
    // scrollToBottom() {
    //     const scrollHeight = this.messageList.scrollHeight;
    //     const height = this.messageList.clientHeight;
    //     const maxScrollTop = scrollHeight - height;
    //     this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    // }

    // componentDidUpdate() {
    //     this.scrollToBottom();
    // }

    changeChatContacts() {
        this.setState({
            isUser: !this.state.isUser,
            username: "",
            sellername: "",
            messageList: [],
            message: ""
        });
    }

    getYourMessageUser(othername, username) {
        let count = 0;
        getMessagesFromUser(username, othername).once("value").then(snapshot => {
            for (let key in snapshot.val()) {
                if (
                    snapshot.val()[key].author === "them" &&
                    snapshot.val()[key].read === false
                ) {
                    count++;
                }
            }
            let temp = this.state.unreadUser;
            console.log(othername, count);
            temp[othername] = count;
            this.setState({
                unreadUser: temp
            });
        });
    }

    getYourMessageSeller(shopName, username) {
        let count = 0;
        getMessages(username, shopName).once("value", snapshot => {
            for (let key in snapshot.val()) {
                if (
                    snapshot.val()[key].author === "them" &&
                    snapshot.val()[key].read === false
                ) {
                    count++;
                    console.log("count", count);
                }
            }
            let temp = this.state.unread;
            console.log(shopName, count);
            temp[shopName] = count;
            this.setState({
                unread: temp
            });
        });
    }

    changeSeller(shopName, username) {
        if (this.state.username !== "") {
            getMessagesFromUser(username, this.state.username).off();
        }
        if (this.state.sellername !== "") {
            getMessages(username, this.state.sellername).off();
        }
        this.setState(
            {
                sellername: shopName
            },
            () => {
                let self = this;
                getMessages(username, this.state.sellername).on("value", function (
                    snapshot
                ) {
                    let temp = [];
                    let update = {};
                    for (let key in snapshot.val()) {
                        if (snapshot.val().hasOwnProperty(key)) {
                            update["/" + key + "/read"] = true;
                            temp.push(snapshot.val()[key]);
                        }
                    }
                    console.log(temp);
                    getMessages(username, self.state.sellername).update(update);
                    self.setState({
                        messageList: temp
                    });
                });
            }
        );
    }

    changeUser(otheruser, username) {
        if (this.state.username !== "") {
            getMessagesFromUser(username, this.state.username).off();
        }
        if (this.state.sellername !== "") {
            getMessages(username, this.state.sellername).off();
        }
        this.setState(
            {
                username: otheruser
            },
            () => {
                let self = this;
                getMessagesFromUser(username, this.state.username).on("value", function (
                    snapshot
                ) {
                    let temp = [];
                    let update = {};
                    for (let key in snapshot.val()) {
                        if (snapshot.val().hasOwnProperty(key)) {
                            update["/" + key + "/read"] = true;
                            temp.push(snapshot.val()[key]);
                        }
                    }
                    console.log(temp);
                    getMessagesFromUser(username, self.state.username).update(update);
                    self.setState({
                        messageList: temp
                    });
                });
            }
        );
    }

    componentDidMount() {
        console.log(this.props);
        if (checkIntialized() && this.props.location.state !== undefined) {
            if (this.props.location.state.username !== undefined) {
                this.setState({
                    username: this.props.location.state.username
                });
                this.changeUser(this.props.location.state.username, userData.username);
            }
            if (this.props.location.state.message !== undefined) {
                this.setState({
                    message: this.props.location.state.message
                });
            }
            if (this.props.location.state.sellername !== undefined) {
                this.setState({
                    sellername: this.props.location.state.sellername,
                    isUser: false
                });
                this.changeSeller(
                    this.props.location.state.sellername,
                    userData.username
                );
            }
        }
        let self = this;
        this.props.client.query({
            query: GET_AUTH
        }).then((data) => {
            self.props.client.query({
                query: GET_USER,
                variables: {username: data.data.auth.user.username}
            }).then(
                datauser => {
                    console.log('userData', datauser);
                    datauser.data.User.followingShop.map((value) => {
                        this.getYourMessageSeller(value.shopName, data.data.auth.user.username);
                    });
                    datauser.data.User.following.map((value) => {
                        this.getYourMessageUser(value.username, data.data.auth.user.username);
                    });
                }
            );
        });
    }

    onTyping(e) {
        this.setState({
            message: e.target.value
        });
    }

    onSubmit(username) {
        console.log("clicked", this.state.username);
        if (this.state.message === '') {
            return;
        }
        if (this.state.isUser) {
            sendMessageUserToUser(username, this.state.message, this.state.username).then((data) => {
                console.log('data', data);
                this.props.client.mutate({
                    mutation: gql`mutation{
                                    makeChatNotify(to:"${this.state.username}")
                                    }`
                }).then((data) => {
                    console.log('data', data);
                });
            });


        } else {
            sendMessageUserToSeller(
                username,
                this.state.message,
                this.state.sellername
            ).then((data) => {
                this.props.client.mutate({
                    mutation: gql`mutation{
                                    makeChatNotifyToSeller(to:"${this.state.sellername}")
                                    }`
                }).then((data) => {
                    console.log('data', data);
                });
            });
        }
        this.setState({
            message: ""
        });

    }

    render() {
        return (
            <Query query={GET_AUTH}>
                {({data, loading}) => {
                    userData = data.auth.user;
                    return (
                        <Query
                            query={GET_USER}
                            variables={{username: data.auth.user.username}}
                        >
                            {({data, loading}) => {
                                console.log("username", data);
                                if (loading) return <p>loading....</p>;

                                return (
                                    <div className="wrapper">
                                        <div className="container">
                                            <div className="left">
                                                <div className="top">
                                                    <input type="text" placeholder="Search"/>
                                                    <a href="javascript:" className="search"/>
                                                    <Button
                                                        type={"primary"}
                                                        className='shift-button'
                                                        onClick={() => this.changeChatContacts()}
                                                    >
                                                        {this.state.isUser ? "Sellers" : "Users"}
                                                    </Button>
                                                </div>

                                                {this.state.isUser ? (
                                                    <ul className="people">
                                                        {data.User.following.map((value, index) => {
                                                            return (
                                                                <li
                                                                    className="person"
                                                                    key={index}
                                                                    onClick={() => {
                                                                        this.changeUser(
                                                                            value.username,
                                                                            userData.username
                                                                        );
                                                                    }}
                                                                >
                                                                    <img src={value.image} alt=""/>
                                                                    <span className="name">
                                                                        {value.username}
                                                                    </span>
                                                                    <button className="btn-circle">
                                                                        {this.state.unreadUser[value.username]}
                                                                    </button>
                                                                    <span className="preview">{value.about}</span>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                ) : (
                                                    <ul
                                                        className="people"
                                                    >
                                                        {data.User.followingShop.map((value, index) => {

                                                            return (
                                                                <li
                                                                    className="person"
                                                                    key={index}
                                                                    onClick={() => {
                                                                        this.changeSeller(
                                                                            value.shopName,
                                                                            userData.username
                                                                        );
                                                                    }}
                                                                >
                                                                    <img src={value.image} alt=""/>
                                                                    <span className="name">
                                                                        {value.shopName}
                                                                    </span>
                                                                    <button className="btn-circle">
                                                                        {this.state.unread[value.shopName]}
                                                                    </button>
                                                                    <span className="preview">{value.about}</span>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="right">
                                                <div className="top">
                                                    <span>
                                                        To:&nbsp;
                                                        <span className="name">
                                                            {this.state.isUser
                                                                ? this.state.username
                                                                : this.state.sellername}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="active-chat">
                                                    <div
                                                        style={{overflowY: "scroll", height: "450px"}}
                                                        className="conversation-start"
                                                        ref={(div) => {
                                                            this.messageList = div;
                                                        }}

                                                    >
                                                        <br/>
                                                        {this.state.messageList.map((value, index) => {
                                                            if (value.author === "them") {
                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className="bubble you"
                                                                        style={{marginLeft: "10px"}}
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: value.message
                                                                        }}
                                                                    />
                                                                );
                                                            } else {
                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className="bubble me"
                                                                        style={{marginRight: "10px"}}
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: value.message
                                                                        }}
                                                                    />
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="write">
                                                    {/*<a href="javascript:" className="write-link attach"/>*/}
                                                    <input
                                                        type="text"
                                                        value={this.state.message}
                                                        onChange={e => {
                                                            this.onTyping(e);
                                                        }}
                                                    />
                                                    <a
                                                        onClick={() => this.onSubmit(userData.username)}
                                                        className="write-link send"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        </Query>
                    );
                }}
            </Query>
        );
    }
}

export default withApollo(Demo);
