import React, {Component} from 'react';
import {Card, Row, Col, Divider, Button} from 'antd';
import {Link} from 'react-router-dom';

const CardTitle = (props) => (
    <div style={{width: '100%'}}>
        <div className="float-left">
            <Link to={`/order/${props.order.order_number}/`}>
                <Button className='theme_button'>OD{props.order.order_number}</Button>
            </Link>
        </div>
        {/*<div className="float-right">*/}
        {/*<Button type={'ghost'}>Track</Button>*/}
        {/*</div>*/}
    </div>
);

const StatusRender = ({product}) => {
    console.log(product.status);
    if (!product.status.confirmed) {
        return (
            <div>
                <div>Product is under process</div>
                <small>Seller will confirm your order</small>
            </div>
        );
    } else if (product.status.delivered) {
        return (
            <div>
                <div>Product is Delivered</div>
            </div>
        );
    } else if (product.status.shipped) {
        return (
            <div>
                <div> Product is being Delivered</div>
                <small>Product is with our shipping partner</small>
            </div>
        );
    } else if (product.status.confirmed) {
        return (
            <div>
                <div> Product is confirmed</div>
                <small>Seller will ship your order</small>
            </div>
        );
    }
};

const ProductListing = ({product, trackOrder}) => (
    <Row>
        <Col sm={0} xs={3} />
        <Col sm={3} xs={18} className='text-center'>
            <img className='img-fluid'
                 src={`${product.product.image}`}
                 alt={product.product.name}/>
        </Col>
        <Col sm={1}/>
        <Col sm={7} xs={18}>
            <Link to={'/product/' + product.product.id}>{product.product.name}</Link>
            {product.selectedSize !== "undefined" && (
                <div>
                    <small>Size : {product.selectedSize}</small>
                </div>
            )}
            <div>
                <small>Quantity : {product.itemCount}</small>
            </div>
        </Col>
        <Col sm={3} xs={6}>
            <div>Rs. {product.product.price}</div>
        </Col>
        <Col sm={10} xs={24}>
            <div className="float-right">
                <Button type={'ghost'} onClick={() => {
                    trackOrder(product);
                }}>Track</Button>
            </div>
            <StatusRender product={product}/>
        </Col>

    </Row>
);

const OrderFooter = (props) => (
    <Row>
        <Col sm={12} xs={24}>
            Ordered on {new Date(1538518100405).toLocaleString()}
        </Col>
        <div className="float-right">
            <strong>Order Total : </strong> Rs.{props.total}
        </div>
    </Row>
);

class OrderListCard extends Component {

    constructor(props) {
        super(props);
        this.trackOrder = this.trackOrder.bind(this);
    }

    trackOrder(order) {
        console.log(order);
        this.props.history.push({
            pathname: `/order/${this.props.order.order_number}/${order._id}`,
            state: {
                order: order
            }
        });
    }

    render() {

        const data = this.props.order;
        console.log(data);

        return (
            <Card title={<CardTitle order={data}/>} className={'grey-header'} style={{marginBottom: 20}}>
                {
                    data.products.map(
                        (product, index) => (
                            <div key={index}>
                                <ProductListing product={product} trackOrder={this.trackOrder}/>
                                <Divider/>
                            </div>
                        )
                    )
                }
                <OrderFooter total={data.total}/>
            </Card>
        );
    }
}


export default OrderListCard;
