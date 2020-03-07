import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Col, Row} from 'antd';
import {Query, withApollo} from 'react-apollo';
import {ADD_ORDER_CART, GET_CART} from "../../query";


class CheckoutReview extends Component {

    state = {
        address: {}
    };

    constructor(props) {
        super(props);
        this.placeOrder = this.placeOrder.bind(this);
    }

    getProductsTotal(data) {
        let total = 0;
        data.items.forEach(
            cartItem => total += cartItem.item.price * cartItem.itemCount
        );
        return total;
    }

    placeOrder() {
        let address = this.state.address;
        this.props.client.mutate({
            mutation: ADD_ORDER_CART,
            variables: {
                "input": {
                    "address": this.state.address
                }
            }
        }).then(({data}) => {
            console.log(data);
            console.log(data.addOrderFromCart.order);
            let order = data.addOrderFromCart.order ;
            this.props.history.push({
                pathname: '/checkout/submit',
                state: {
                    order
                }
            });
        });


    }

    componentWillMount() {
        console.log("Sate Route : ", this.props.location.state);
        if (this.props.location.state) {
            let {address} = this.props.location.state;
            if (address) {
                delete address.__typename;
                this.setState({
                    address
                });
            } else {
                this.props.history.push('/cart');
            }
        } else {
            this.props.history.push('/cart');
        }
    }

    render() {
        return (
            <div>
                <Query query={GET_CART} fetchPolicy={'cache-and-network'}>
                    {({loading, error, data}) => {
                        // console.log(loading, error, data);

                        if (loading) return <p>Loading...</p>;
                        if (error) return <p>Error :(</p>;
                        data = data.getCart;
                        console.log(data);
                        return (
                            <div className="bg-grey">
                                <div className="max_width_980">
                                    <div className="cart_content">
                                        <div className="cart_title">
                                            <h3>Review Order</h3>
                                            {/*<p>{data.items.length} item{data.items.length > 1 ? 's' : ''} in your cart</p>*/}
                                        </div>
                                        <Row>
                                            <Col lg={16} md={16} sm={24} xs={24}  className="left_part">
                                                {
                                                    data.items.map((cartItem, index) => {
                                                        return (
                                                            <div className="item" key={index}>
                                                                <div className='item_seller'>
                                                                    <div className='item_seller_image'>
                                                                        <img src={cartItem.item.seller.image}
                                                                             alt=''
                                                                             style={{width: 32, height: 32}}/>
                                                                    </div>
                                                                    <span>{cartItem.item.seller.name}</span>
                                                                </div>

                                                                <Row>
                                                                    <Col span={8}>
                                                                        <img src={cartItem.item.image}
                                                                             alt={cartItem.item.name}/>
                                                                    </Col>
                                                                    <Col span={16}>
                                                                        <div className="item_title">
                                                                            <Link to={"shop/" + cartItem.item.id}>
                                                                            <span
                                                                                className='item_title_name'>{cartItem.item.name}</span>
                                                                            </Link>
                                                                            <span
                                                                                className='item_title_price'>₹ {cartItem.item.price}</span>
                                                                        </div>
                                                                        {/*<p>{cartItem.item.description}</p>*/}

                                                                        <div>
                                                                            <small>
                                                                                Selected Size : {cartItem.selectedSize}
                                                                            </small>
                                                                        </div>
                                                                        <div>
                                                                            <small>
                                                                                Item Count : {cartItem.itemCount}
                                                                            </small>
                                                                        </div>

                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </Col>
                                            <Col className="checkout" style={{paddingLeft: '10px'}} lg={8} md={8} sm={24} xs={24}>
                                                <div className='checkout_address'>
                                                    <h4>Ship To :</h4>
                                                    <p>
                                                        {this.state.address.address} , {this.state.address.street} <br/>
                                                        {this.state.address.city} , {this.state.address.state} <br/>
                                                        {this.state.address.zipcode}
                                                    </p>
                                                </div>
                                                <div className='checkout_address'>
                                                    <h4>Total Amount : <span>₹ {this.getProductsTotal(data)}</span></h4>
                                                </div>
                                                <Button onClick={this.placeOrder} className='theme_button'>
                                                    Place Order
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                    <p style={{paddingBottom: '10px', textAlign: 'center'}}>For help, contact us.</p>
                                </div>
                            </div>
                        );
                    }}
                </Query>

            </div>
        );
    }
}

CheckoutReview.propTypes = {};

export default withApollo(CheckoutReview);
