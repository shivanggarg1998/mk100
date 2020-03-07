import React from "react";
import {Col, Icon, Row, Tabs} from "antd";
import {FOLLOW_USER, GET_AUTH, GET_USER, UNFOLLOW_USER} from "../../query";
import {Query, withApollo} from "react-apollo";
import NotFound from "../NotFound";

import UserPosts from "./UserPosts";
import UserFollowingShops from "./UserFollowingShops";
import Wishlist from "./Wishlist";

const {TabPane} = Tabs;

class User extends React.Component {
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
    gettochat(username)
    {
        this.props.history.push({
            pathname: '/chat',
            state: { username: username }
          })
    }
    render() {

        let username = this.props.match.params.id;
        console.log(this.props);

        return (
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
                                return <p>Error...</p>;
                            }
                            const user = data_1.User;
                            const me = data_2.auth.user;

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
                                <div className="bg-grey">
                                    <div className="container">
                                        <div className="profile">
                                            <Row>
                                                <Col span={6}>
                                                    <div className="profile__image"/>
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
                                                            <button onClick={()=>this.gettochat(user.username)}>Message</button>
                                                                : ''
                                                            }
                                                        </div>)}
                                                    </div>
                                                    <p className="tagline">
                                                        <strong>{user.name}</strong>
                                                    </p>
                                                    <p className="tagline">{user.about}</p>

                                                    <p className="stats">
                                                      <span className="numbers">
                                                        <Icon type="file"/>
                                                        <span className="posts">0</span> posts
                                                      </span>
                                                        <span className="numbers">
                                                        <Icon type="user"/>
                                                        <span className="connections">
                                                          {user.followers.length}
                                                        </span>{" "}
                                                            follower
                                                      </span>
                                                        <span className="numbers">
                                                        <Icon type="user-add"/>
                                                        <span className="connections">
                                                          {" "}
                                                            {user.following.length}
                                                        </span>{" "}
                                                            following
                                                      </span>
                                                    </p>

                                                </Col>
                                            </Row>
                                            {(isAFollower || myProfile) && (<Row className="profile__details">
                                                <Col span={24}>
                                                    <Tabs
                                                        defaultActiveKey="1"
                                                        size="default"
                                                        style={{textAlign: "center"}}
                                                    >
                                                        <TabPane tab="WishList" key="1">
                                                            {/*Content of tab 1*/}
                                                            <Wishlist user={user.id}/>
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
                                            {(!isAFollower && !myProfile) && (
                                                <div className='account_private'>
                                                    <div className='account_private__header'>This Account is Private
                                                    </div>
                                                    <p className='account_private__content'>Follow to see their posts
                                                        and wishlists</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    </Query>
                )}
            </Query>
        );


    }
};

export default withApollo(User);
