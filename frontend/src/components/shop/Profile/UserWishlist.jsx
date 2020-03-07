import React from 'react';
import {Link} from 'react-router-dom';
import {Row, Col, Card} from 'antd';
import {Query, withApollo} from 'react-apollo';
import {GET_WISHLIST} from "../../query";

const {Meta} = Card;

class UserWishlist extends React.Component {

    render() {
        return (
            <Query query={GET_WISHLIST} variables={{user: this.props.user ? this.props.user : "nil"}}>
                {({loading, error, data}) => {
                    console.log(error);

                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;

                    data = data.showWishlist;

                    if (!data || data.products.length === 0) return (
                        <div className="bg-grey">
                            <div style={{textAlign : 'center'}}>
                                <div className="cart_title">
                                    <h2>Wishlist Empty</h2>
                                </div>
                            </div>
                        </div>
                    );
                    console.log(data);

                    return (

                        <div className="bg-grey">
                            <Row gutter={16}>
                                {
                                    data.products.map((product, index) => {
                                        return (
                                            <Col sm={8} xs={8} md={6} lg={6} key={index}>
                                                <Link to={`/user/${data.user.username}/product/${product.id}`}>
                                                    <Card
                                                        key={index}
                                                        hoverable
                                                        cover={<img alt={product.name} src={product.image}/>}
                                                    >
                                                        <Meta
                                                            title={product.name}
                                                            description={product.seller.name}
                                                        />
                                                    </Card>
                                                </Link>
                                            </Col>
                                        );
                                    })
                                }
                            </Row>

                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default withApollo(UserWishlist);
