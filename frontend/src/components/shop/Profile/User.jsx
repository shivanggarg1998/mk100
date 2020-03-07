import React from "react";
import {Col, Icon, Row, Tabs, Switch, Modal, Button, message} from "antd";
import {FOLLOW_USER, GET_AUTH, GET_USER, UNFOLLOW_USER, CHANGE_VISBILITY} from "../../query";
import {Query, withApollo} from "react-apollo";

import NotFound from "../NotFound";
import Details from '../Product/Details' ;
import {ModalRoute} from 'react-router-modal';

import UserPosts from "./UserPosts";
import UserFollowingShops from "./UserFollowingShops";
import UserWishlist from "./UserWishlist";
import UserFollowerFollowing from "./UserFollowerFollowing";

const {TabPane} = Tabs;

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {width: 0, height: 0, visible: 0};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    handleCancel() {
        this.setState({
            visible: 0
        });
    }

    getToChat(username) {
        this.props.history.push({
            pathname: '/chat',
            state: {username: username}
        });
    }

    handleFollowClick(isAFollower, FollowingID) {
        // TODO : Change Refetch To Cache Update
        console.log("Follow ID", FollowingID);
        if (!isAFollower) {
            this.props.client.mutate({
                mutation: FOLLOW_USER,
                refetchQueries: ['user'],
                variables: {
                    FollowingID
                }
            }).then(data => {
                console.log("Follow User : ", data);
            });
        } else {
            this.props.client.mutate({
                mutation: UNFOLLOW_USER,
                refetchQueries: ['user'],
                variables: {
                    FollowingID
                }
            }).then(data => {
                console.log("UN-Follow User : ", data);
            });
        }
    }

    onChangeVisibility(changed) {
        console.log(changed);
        this.props.client.mutate({
            mutation: CHANGE_VISBILITY,
            variables: {val: changed}
        }).then(
            data => {
                if (data) {
                    message.info("Changed");
                }
            }
        );
    }

    render() {

        let username = this.props.match.params.id;
        console.log(this.props);

        return (
            <div>
                <Query query={GET_USER}
                       variables={{
                           username: username
                       }}>
                    {({loading: loading_1, error: error_1, data: data_1}) => (
                        <Query query={GET_AUTH}>
                            {({loading: loading_2, error: error_2, data: data_2}) => {
                                if (loading_1 || loading_2) {
                                    return <p>Loading...</p>;
                                }
                                if (error_1 || error_2) {
                                    return <p>Eroor...</p>;
                                }
                                const user = data_1.User;
                                const me = data_2.auth.user;

                                const isProfilePublic = user.public;

                                console.log("Profile Data : ", user);
                                if (user === null) {
                                    return <NotFound/>;
                                }
                                let myProfile = false;
                                if (me.id === user.id) {
                                    myProfile = true;
                                }


                                let isAFollower = false;
                                let button_text = "Follow";
                                user.followers.forEach(follower => {
                                    if (follower.id === me.id) {
                                        isAFollower = true;
                                        return;
                                    }
                                });
                                console.log(isAFollower);
                                if (isAFollower) {
                                    button_text = "UnFollow";
                                    isAFollower = true;

                                }


                                return (
                                    <div className="container">
                                        <div className="profile">
                                            <Row gutter={8}>
                                                <Col span={6}>
                                                    <div className="profile__image"
                                                         style={{backgroundImage: `url('${user.image}'`}}/>
                                                </Col>
                                                <Col className="profile__info" span={18}>
                                                    <div>
                                                        <h1 style={{display: 'inline-block'}}>{user.username}</h1>
                                                        {!myProfile && (<div className="button_group">
                                                            <button onClick={() => {
                                                                this.handleFollowClick(isAFollower, user.id);
                                                            }}>
                                                                {button_text}
                                                            </button>
                                                            {isAFollower ?
                                                                <button
                                                                    onClick={() => this.getToChat(user.username)}>Message</button>
                                                                : ''
                                                            }
                                                        </div>)}
                                                        {myProfile && (<div className='edit_profile' style={{
                                                            display: 'inline-block',
                                                            float: 'right',
                                                            marginRight: '20px'
                                                        }}>
                                                            <Switch
                                                                checkedChildren="Public"
                                                                unCheckedChildren="Private"
                                                                defaultChecked={user.public}
                                                                onChange={this.onChangeVisibility.bind(this)}
                                                            />
                                                            <Icon
                                                                type="edit"
                                                                style={{
                                                                    margin: '0 10px',
                                                                    fontSize: '20px',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => this.props.history.push(`/user/${username}/edit/`)}
                                                            />
                                                        </div>)}
                                                    </div>
                                                    {
                                                        this.state.width > 600 && (
                                                            <div>
                                                                <p className="tagline">
                                                                    <strong>{user.name}</strong>
                                                                </p>
                                                                <p className="tagline">{user.about}</p>

                                                                <p className="stats">
                                                                    <span className="numbers">
                                                                        <Icon type="file"/>
                                                                        <span className="posts">
                                                                            0
                                                                        </span>{" "}
                                                                        posts
                                                                    </span>

                                                                    <span
                                                                        className="numbers"
                                                                        onClick={() => this.setState({visible: 1})}
                                                                        style={{cursor: 'pointer'}}
                                                                    >
                                                                        <Icon type="user"/>
                                                                        <span className="connections">
                                                                            {user.followers.length}
                                                                        </span>{" "}
                                                                        follower
                                                                    </span>

                                                                    <span
                                                                        className="numbers"
                                                                        onClick={() => this.setState({visible: 2})}
                                                                        style={{cursor: 'pointer'}}
                                                                    >
                                                                        <Icon type="user-add"/>
                                                                        <span className="connections">
                                                                            {user.following.length}
                                                                        </span>{" "}
                                                                        following
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        )
                                                    }


                                                    {(isProfilePublic || isAFollower || myProfile) && (
                                                        <Modal
                                                            title={this.state.visible === 1 ? "Followers" : "Following"}
                                                            visible={!!this.state.visible}
                                                            onCancel={this.handleCancel.bind(this)}
                                                            footer={[
                                                                <Button key="back"
                                                                        onClick={this.handleCancel.bind(this)}>Back</Button>
                                                            ]}
                                                        >
                                                            {(
                                                                this.state.visible > 0 &&
                                                                <UserFollowerFollowing id={this.state.visible}
                                                                                       username={username}/>
                                                            )}
                                                        </Modal>
                                                    )}

                                                </Col>
                                            </Row>
                                            {
                                                this.state.width <= 600 && (
                                                    <div className='profile__info    '>
                                                        <p className="tagline">
                                                            <strong>{user.name}</strong>
                                                        </p>
                                                        <p className="tagline">{user.about}</p>

                                                        <p className="stats">
                                                            <span className="numbers">
                                                                <Icon type="file"/>
                                                                <span className="posts">
                                                                    0
                                                                </span>{" "}
                                                                posts
                                                            </span>

                                                            <span
                                                                className="numbers"
                                                                onClick={() => this.setState({visible: 1})}
                                                                style={{cursor: 'pointer'}}
                                                            >
                                                                <Icon type="user"/>
                                                                <span className="connections">
                                                                    {user.followers.length}
                                                                </span>{" "}
                                                                follower
                                                            </span>

                                                            <span
                                                                className="numbers"
                                                                onClick={() => this.setState({visible: 2})}
                                                                style={{cursor: 'pointer'}}
                                                            >
                                                                <Icon type="user-add"/>
                                                                <span className="connections">
                                                                    {user.following.length}
                                                                </span>{" "}
                                                                following
                                                            </span>
                                                        </p>
                                                    </div>
                                                )
                                            }
                                            {(isProfilePublic || isAFollower || myProfile) && (
                                                <Row className="profile__details">
                                                    <Col span={24}>
                                                        <Tabs
                                                            defaultActiveKey="1"
                                                            size="default"
                                                            style={{textAlign: "center"}}
                                                        >
                                                            <TabPane tab="WishList" key="1">
                                                                {/*Content of tab 1*/}
                                                                <UserWishlist user={user.id}/>
                                                            </TabPane>
                                                            <TabPane tab="Posts" key="2">
                                                                <UserPosts username={username}/>
                                                            </TabPane>
                                                            <TabPane tab="Shops" key="3">
                                                                <UserFollowingShops ids={user.followingShop}/>
                                                            </TabPane>
                                                        </Tabs>
                                                    </Col>
                                                </Row>)}
                                            {(!isProfilePublic && !isAFollower && !myProfile) && (
                                                <div className='account_private'>
                                                    <div className='account_private__header'>This Account is Private
                                                    </div>
                                                    <p className='account_private__content'>Follow to see their
                                                        posts
                                                        and wishlists</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
                        </Query>

                    )}
                </Query>
                {console.log(this.props.match.url)}
                <ModalRoute
                    path={`${this.props.match.url}/product/:id`}
                    parentPath={this.props.match.url}
                    component={Details}
                />
            </div>
        );


    }
}

export default withApollo(User);
