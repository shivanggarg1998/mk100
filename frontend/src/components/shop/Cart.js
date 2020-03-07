import React from 'react';
import {Link} from 'react-router-dom';
import {Col , Button, Row, Icon, notification} from 'antd';
import {Query, withApollo} from 'react-apollo';
import {GET_CART, REMOVE_FROM_CART} from "../query";


class Cart extends React.Component {

    constructor(props) {
        super(props);
        this.handleCheckout = this.handleCheckout.bind(this);
        this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this);
    }

    getCartTotal(data) {
        let total = 0;
        data.items.forEach(
            cartItem => total += cartItem.item.price * cartItem.itemCount
        );
        return total;
    }

    handleCheckout() {
        this.props.history.push('/checkout/shipping');
    }

    handleRemoveFromCart(index) {
        console.log(index);
        this.props.client.mutate({
            mutation: REMOVE_FROM_CART,
            variables: {index: index}
        })
        .then(
            data => {
                console.log(data);
                notification.open({
                    message: 'Removed from Cart',
                    duration: 2
                });
            }
        )
    }

    render() {
        return (
            <Query query={GET_CART} fetchPolicy={'cache-and-network'}>
                {({loading, error, data}) => {
                    console.log(loading, error, data);

                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;

                    data = data.getCart;

                    if (!data) return (
                        <div className="bg-grey">
                            <div className="container_160">
                                <div className="cart_title">
                                    <h2>Cart Empty</h2>
                                </div>
                            </div>
                        </div>
                    );
                    console.log(data);

                    return (
                        <div className="bg-grey">
                            <div className="max_width_980">
                                <div className="cart_content">
                                    <div className="cart_title">
                                        <h3>My Cart</h3>
                                        <p>{data.items.length} item{data.items.length > 1 ? 's' : ''} in your cart</p>
                                    </div>
                                    <Row>
                                        <Col lg={16} md={16} sm={24} xs={24} className="left_part">
                                            {
                                                data.items.map((cartItem, index) => {
                                                    return (
                                                        <div className="item" key={index}>
                                                            <div className='item_seller' style={{paddingRight: '0px'}}>
                                                                <div className='item_seller_image'>
                                                                    <img 
                                                                        src={cartItem.item.seller.image}
                                                                        alt=''
                                                                        style={{width: 32, height: 32}}
                                                                    />
                                                                </div>
                                                                <span>{cartItem.item.seller.name}</span>
                                                                <span 
                                                                    style={{
                                                                        float: 'right',
                                                                        color: 'red',
                                                                        fontWeight: 'bold',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={() => this.handleRemoveFromCart(index)}
                                                                >
                                                                    <Icon type="delete" theme="outlined" />
                                                                </span>
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
                                            <div className="total">
                                                <p>Item(s) total</p>
                                                <span>₹ {this.getCartTotal(data)}</span>
                                            </div>
                                            <Button className='theme_button' onClick={this.handleCheckout}>Checkout</Button>
                                        </Col>
                                    </Row>
                                </div>
                                <p style={{paddingBottom: '10px', textAlign: 'center'}}>For help, contact us.</p>
                            </div>
                        </div>
                    );
                }}
            </Query>

        );
    }
}

export default withApollo(Cart);
