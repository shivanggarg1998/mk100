import React, {Component} from 'react';
import {Query} from 'react-apollo' ;
import {Card, Row, Col} from 'antd';
import PropTypes from 'prop-types';
import {GET_SELLER} from "../Query/query";

const {Meta} = Card;

class SellerDetails extends Component {
    render() {
        const {seller} = this.props;
        console.log(this.props);
        return (
            <Query query={GET_SELLER} variables={{input: seller}}>
                {({data, loading}) => {
                    if (loading) {
                        return "Loading";
                    } else {

                        data = data.Seller;

                        return (
                            <div style={{padding: 15, maxWidth: 800, margin: 'auto'}}>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Card
                                            hoverable
                                            cover={<img alt="image" src={data.image}/>}
                                        >
                                            <Meta
                                                title={data.shopName}
                                                description={
                                                    <div>
                                                        <div>Name : {data.name}</div>
                                                        <div>Email : {data.email}</div>
                                                        <div>Mobile : {data.mobile}</div>
                                                        <div>Intro : {data.intro}</div>
                                                        <div>Website : {data.website}</div>
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card
                                            hoverable
                                            cover={<img alt="Bank Details" src={data.legal.cancelled_cheque}/>}
                                        >
                                            <Meta
                                                title={"Bank Details"}
                                                description={
                                                    <div>
                                                        Bank Name : {data.legal.bank.name} <br/>
                                                        Account Number : {data.legal.bank.accountNumber} <br/>
                                                        IFSC Code : {data.legal.bank.ifscCode} <br/>
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card
                                            hoverable
                                            cover={<img alt="Bank Details" src={data.legal.gst_document}/>}
                                        >
                                            <Meta
                                                title={"GST Details"}
                                                description={
                                                    <div>
                                                        GST Number : {data.legal.gst}
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>

                                </Row>
                                <br/>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Card
                                            hoverable
                                            cover={<img alt="aadhar_front" src={data.legal.aadhar_image_front}/>}
                                        >
                                            <Meta
                                                title={"Aadhar Front"}
                                                description={
                                                    <div>
                                                        Aadhar Number : {data.legal.aadhar}
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card
                                            hoverable
                                            cover={<img alt="aadhar_back" src={data.legal.aadhar_image_back}/>}
                                        >
                                            <Meta
                                                title={"Aadhar Back"}
                                                description={
                                                    <div>
                                                        Aadhar Number : {data.legal.aadhar}
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card
                                            hoverable
                                            cover={<img alt="aadhar_back" src={data.legal.pan_image}/>}
                                        >
                                            <Meta
                                                title={"Pan"}
                                                description={
                                                    <div>
                                                        PAN Number : {data.legal.pan}
                                                    </div>
                                                }
                                            />
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

SellerDetails.propTypes = {};

export default SellerDetails;