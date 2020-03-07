import React, {Component} from 'react';
import {Query} from 'react-apollo';
import {Link} from 'react-router-dom';
import {Card, Row, Col} from 'antd';
import {GET_FOLLOW_SELLER} from '../../query';

const {Meta} = Card;

class UserPosts extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        let ids = [];
        this.props.ids.forEach(
            idObj => ids.push(idObj.id)
        );
        return (
            <div>
                <Query query={GET_FOLLOW_SELLER} variables={{
                    ids: ids
                }}>
                    {({loading, data}) => {
                        if (loading) {
                            return "Loading";
                        }
                        data = data.getSellers;
                        console.log(data);

                        return (
                            <Row gutter={16}>
                                {data.map(
                                    (seller, index) => {
                                        return (
                                            <Col sm={8} xs={8} md={6} lg={6} key={index}>
                                                <Link to={`/seller/${seller.shopName}`}>
                                                    <Card
                                                        key={index}
                                                        hoverable
                                                        cover={<img alt={seller.shopName} src={seller.image}/>}
                                                    >
                                                        <Meta
                                                            title={seller.name}
                                                            description={seller.shopName}
                                                        />
                                                    </Card>
                                                </Link>
                                            </Col>
                                        );
                                    }
                                )
                                }
                            </Row>
                        );
                    }}
                </Query>
            </div>
        );
    }
}

export default UserPosts;