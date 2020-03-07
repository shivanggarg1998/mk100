import React from 'react';
import {Link} from 'react-router-dom';
import {Row, Col} from 'antd';
import {Query} from 'react-apollo';
import { GET_WISHLIST } from "../../query";

class Wishlist extends React.Component {

    render() {
        return (
            <div>
                <Query query={GET_WISHLIST} fetchPolicy={'cache-and-network'} variables={{user: "nil"}}>
                    {({loading, error, data}) => {
                        console.log(loading, error, data);

                        if (loading) return <p>Loading...</p>;
                        if (error) return <p>Error :(</p>;

                        data = data.showWishlist;

                        if (!data) return (
                            <div className="bg-grey">
                                <div className="container_160">
                                    <div className="cart_title">
                                        <h2>Wishlist Empty</h2>
                                    </div>
                                </div>
                            </div>
                        );
                        console.log(data);
                        
                        return (
                            <div className="bg-grey">
                                <div className="max_width_980">
                                    <div className="cart_title">
                                        <h2>{data.products.length} item{data.products.length > 1 ? 's' : ''} in your wishlist</h2>
                                    </div>
                                    <div className="cart_content">
                                        <Row>
                                            <Col span={24}>
                                                {
                                                    data.products.map((product, index) => {
                                                        return (
                                                            <div className="item" key={index}>
                                                                <div className='item_seller'>
                                                                    <div className='item_seller_image'>
                                                                        <img 
                                                                            src={product.seller.image}
                                                                            style={{width: 32, height: 32}}
                                                                        />
                                                                    </div>
                                                                    <span>{product.seller.name}</span>
                                                                </div>

                                                                <Row>
                                                                    <Col span={8}>
                                                                        <img 
                                                                            src={product.image}
                                                                            alt={product.name}
                                                                        />
                                                                    </Col>
                                                                    <Col span={16}>
                                                                        <div className="item_title">
                                                                            <Link to={`/user/${data.user.username}/product/${product.id}`}>
                                                                                <span
                                                                                    className='item_title_name'>{product.name}</span>
                                                                            </Link>
                                                                            <span
                                                                                className='item_title_price'>₹ {product.price}</span>
                                                                        </div>
                                                                        <p>{product.description}</p>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                </Query>
            </div>
        );
    }
}

export default Wishlist;