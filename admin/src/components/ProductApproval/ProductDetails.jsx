import React, {Component} from 'react';
import {Query} from "react-apollo";
import {GET_PRODUCT_BY_ID} from "../Query/query";
import {Card, Col, Row, Carousel} from "antd";

const Meta = Card.Meta;

class ProductDetails extends Component {
    render() {
        const {product} = this.props;
        console.log(this.props);
        return (
            <Query query={GET_PRODUCT_BY_ID} variables={{input: product}}>
                {({data, loading}) => {
                    if (loading) {
                        return "Loading";
                    } else {

                        data = data.Product;

                        return (
                            <div style={{padding: 15, maxWidth: 800, margin: 'auto'}}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Card
                                            hoverable
                                            cover={<img alt="image" src={data.image}/>}
                                        >
                                            <Meta
                                                title={data.shopName}
                                                description={
                                                    <div>
                                                        <div>Name : {data.name}</div>
                                                        <div>Price : {data.price}</div>
                                                        <div>COD : {data.codAccepted || "false"}</div>
                                                        <div>Return : {data.returnAcc || "false"}</div>
                                                        <div>Sizes : {data.sizes}</div>
                                                    </div>
                                                }
                                            />
                                        </Card>
                                        <br/>
                                        <Card title={"About"}>
                                            <p>
                                                {data.description}
                                            </p>
                                            <br/>
                                            Keywords : {data.keywords} <br/>
                                            Category : {data.category} <br/>
                                        </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card title={"Product Images"}>
                                            <Carousel autoplay>
                                                {data.images.map(image => (
                                                        <div>
                                                            <img className='img-fluid' src={image} alt=""/>
                                                        </div>
                                                    )
                                                )}
                                            </Carousel>
                                        </Card>
                                        <br/>
                                        <Card title={"Price Distribution"}>
                                            Base Price : {data.priceDistribution.base} <br/>
                                            GST Price : {data.priceDistribution.gst} <br/>
                                            Shipping Cost : {data.priceDistribution.shipping} <br/>
                                            Return Cost : {data.priceDistribution.reverse} <br/>
                                            COD Cost : {data.priceDistribution.cod} <br/>
                                        </Card>

                                    </Col>
                                </Row>
                            </div>
                        );
                    }
                }}
            </Query>
        );
    }
}

ProductDetails.propTypes = {};

export default ProductDetails;