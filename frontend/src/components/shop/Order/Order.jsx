import React, {Component} from 'react';
import {Button, Card, Row, Col, Steps, Divider} from "antd";
import {Query} from "react-apollo";
import {GET_ORDER_BY_NUMBER} from "../../query";
import {Link} from "react-router-dom";

const Step = Steps.Step;

const CardTitle = (props) => (
    <div style={{width  : "100%"}}>
        <div className="float-left">
            <Button className='theme_button'>OD{props.order.order_number}</Button>
        </div>
        <div className="float-right">
            <Button type={'ghost'}>Track</Button>
        </div>
    </div>
);


const ProductListing = (props) => (
    <Row gutter={32}>
        <Col md={3} xs={14} className='text-center'>
            <img className='img-fluid'
                 src={`${props.product.product.image}`}
                 alt={props.product.product.name}/>
        </Col>
        <Col md={8} xs={10}>
            <Link to={'/product/' + props.product.product.id}>{props.product.product.name}</Link>
            {props.product.selectedSize !== "undefined" && (
                <div>
                    <small>Size : {props.product.selectedSize}</small>
                </div>
            )}
            <div>
                <small>Quantity : {props.product.itemCount}</small>
            </div>
        </Col>
        <Col md={8} xs={14} style={{marginTop: '10px'}}>
            <Steps direction={'vertical'} size={"small"}>
                <Step status={'finish'} title="Confirmed" />
                <Step status={'process'} title="Packed" />
                <Step status={'wait'} title="Delivered" />
                <Step status={'wait'} title="Delivered" />
            </Steps>,
        </Col>
        <Col md={5} xs={10}>
            <strong>Rs. {props.product.product.price}</strong>
            <div>
                Need Help
            </div>
        </Col>

    </Row>
);


class Order extends Component {
    render() {
        const order_number = this.props.match.params.order_number;
        console.log(order_number);

        return (
            <div>
                <Query query={GET_ORDER_BY_NUMBER} variables={{input: order_number}}>
                    {({loading, data, error}) => {
                        if (loading) {
                            return <p>Loading...</p>;
                        }
                        if (error) {
                            console.error(error);
                        }

                        data = data.getOrderByNumber;
                        let address = data.shipping.address;
                        console.log(data);

                        return (
                            <div className="bg-grey">
                                <div className="container">
                                    <Card title={<CardTitle order={data}/>} style={{margin: '20px 0'}}>
                                        <Row gutter={32}>
                                            <Col sm={16} xs={13}>
                                                <h6>Delivery Address</h6>
                                                <div>{data.user.name}</div>
                                                <div>{address.address}, {address.street}, {address.city}, {address.state}, {address.zipcode}</div>
                                                <div>Phone : {data.user.mobile}</div>
                                            </Col>
                                            <Col sm={8} xs={11}>
                                                <h6>Actions</h6>
                                                <div>
                                                    <Button className='theme_button'>Email Invoice</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Card style={{marginBottom : 20}}>
                                        {
                                            data.products.map(
                                                (product, index) => (
                                                    <div key={index}>
                                                        <ProductListing product={product}/>
                                                    </div>
                                                )
                                            )
                                        }
                                    </Card>
                                </div>
                            </div>
                        );
                    }}
                </Query>
            </div>
        );
    }
}

Order.propTypes = {};

export default Order;