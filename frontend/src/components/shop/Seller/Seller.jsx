import React from "react";
import {Col, Icon, Row, Tabs,} from "antd";
import {Query, withApollo} from "react-apollo";
import SellerProducts from "./SellerProducts";
import {FOLLOW_SHOP, GET_AUTH, GET_SELLER, UNFOLLOW_SHOP} from "../../query";
import {ModalRoute} from "react-router-modal";
import SellerPostContainer from "./SellerPostContainer";
import Details from "../Product/Details";

const {TabPane} = Tabs;

class Seller extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total_products: 0,
            total_followers: 0,
            total_posts: 0
        };
    }

    handleFollowClick(isAFollower, FollowingID) {
        // TODO : Change Refetch To Cache Update
        if (!isAFollower) {
            this.props.client.mutate({
                mutation: FOLLOW_SHOP,
                refetchQueries: ['getSeller'],
                variables: {
                    FollowingID
                }
            }).then(data => {
                console.log("Follow Shop : ", data);
            });
        } else {
            this.props.client.mutate({
                mutation: UNFOLLOW_SHOP,
                refetchQueries: ['getSeller'],
                variables: {
                    FollowingID
                }
            }).then(data => {
                console.log("UN-Follow Shop : ", data);
            });
        }
    }

    getToChat(sellername) {
        this.props.history.push({
            pathname: '/chat',
            state: {sellername: sellername}
        });
    }

    render() {
        let shopName = this.props.match.params.id;
        return (
            <Query query={GET_SELLER} variables={{shopName: shopName}}>
                {({loading: loading_1, error: error_1, data: data_1}) => (
                    <Query query={GET_AUTH}>
                        {({loading: loading_2, error: error_2, data: data_2}) => {
                            if (loading_1 || loading_2) {
                                return <p>Loading...</p>;
                            }
                            if (error_1 || error_2) {
                                return <p>Error...</p>;
                            }
                            // console.log(data_1);
                            // console.log(data_2);

                            let data = data_1.Seller;
                            let user = data_2.auth.user;
                            let isAFollower = false;
                            let button_text = "Follow";
                            data.followers.forEach(follower => {
                                if (follower.id === user.id) {
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
                                            <Row gutter={8}>
                                                <Col span={6}>
                                                    <div className="profile__image"
                                                         style={{backgroundImage: `url('${data.image}')`}}/>
                                                </Col>
                                                <Col className="profile__info" span={18}>
                                                    <div>
                                                        <h1 style={{display: 'inline-block'}}>{data.name}</h1>
                                                        <div className="button_group">
                                                            <button onClick={() => {
                                                                this.handleFollowClick(isAFollower, data.id);
                                                            }}>
                                                                {button_text}
                                                            </button>
                                                            {isAFollower ?
                                                                <button
                                                                    onClick={() => this.getToChat(data.shopName)}>Message</button>
                                                                : ''
                                                            }
                                                        </div>
                                                    </div>
                                                    <p className="tagline">
                                                        {data.intro}
                                                    </p>
                                                    <p className="stats">
                                                        <span className="numbers">
                                                          <Icon type="file"/>
                                                          <span className="posts">{this.state.total_posts}</span> posts
                                                        </span>
                                                        <span className="numbers">
                                                          <Icon type="user"/>
                                                          <span className="followers">
                                                            {data.followers.length}
                                                          </span>
                                                            followers
                                                        </span>
                                                        <span className="numbers">
                                                          <Icon type="user-add"/>
                                                          <span
                                                              className="connections">{this.state.total_products}</span> products
                                                        </span>
                                                    </p>

                                                </Col>
                                            </Row>
                                            <Row className="profile__details">
                                                <Col span={24}>
                                                    <Tabs
                                                        defaultActiveKey="1"
                                                        size="default"
                                                        style={{textAlign: "center"}}
                                                    >
                                                        <TabPane tab="Products" key="1">
                                                            <SellerProducts seller={data.id} {...this.props} />
                                                        </TabPane>
                                                        <TabPane tab="Posts" key="2">
                                                            <SellerPostContainer shopName={data.name} seller={data.id}/>
                                                        </TabPane>

                                                        <TabPane tab="About" key="3">
                                                            <div className="profile__about">
                                                                <h3>About {data.name}</h3>
                                                                <p>{data.about}</p>
                                                            </div>
                                                        </TabPane>
                                                        <TabPane tab="Store Policy" key="4">
                                                            <div className="profile__about">
                                                                <div>
                                                                    <h3>Store Policy</h3>
                                                                    <div
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: data.policy.store
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <h3>Return Policy</h3>
                                                                    <div
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: data.policy.return
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </TabPane>
                                                    </Tabs>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    <ModalRoute
                                        path={`${this.props.match.url}/product/:id`}
                                        parentPath={this.props.match.url}
                                        component={Details}
                                    />
                                </div>

                            );
                        }}
                    </Query>
                )}

            </Query>
        );
    }
}

export default withApollo(Seller);
