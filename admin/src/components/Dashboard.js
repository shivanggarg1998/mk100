import React, {Component} from 'react';
import {Col, Row, Card} from 'antd';
import SalesSummaryChart from "./Dashboard/SalesSummaryChart";
import SalesDetailsChart from "./Dashboard/SalesDetailsChart";
import UniqueUsersChart from "./Dashboard/UniqueUsersChart";
import ProductSoldSummaryChart from "./Dashboard/ProductSummaryChart";
import NotificationCard from "./Dashboard/NotificationCard";
import {Query} from 'react-apollo';
import {GET_AUTH} from "./Query/query";

const chartRowResponsive = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 12,
    xl: 12,
    style: {marginBottom: 24},
};

const cardRowResponsive = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12,
    style: {marginBottom: 24},
};


class Dashboard extends Component {
    render() {
        return (
            <Query query={GET_AUTH}>
                {({data, loading}) => {
                    console.log(data, loading);
                    if (!loading) {
                        return (
                            <div>
                                <Row gutter={24}>
                                    <Col {...cardRowResponsive}>
                                        <Row gutter={24}>
                                            <Col {...chartRowResponsive}>
                                                <UniqueUsersChart/>
                                            </Col>
                                            <Col {...chartRowResponsive}>
                                                <SalesSummaryChart/>
                                            </Col>
                                            <Col {...chartRowResponsive}>
                                                <ProductSoldSummaryChart/>
                                            </Col>
                                            <Col {...chartRowResponsive}>
                                                <SalesSummaryChart/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col {...cardRowResponsive}>
                                        <NotificationCard history={this.props.history} user={data}/>
                                    </Col>
                                </Row>


                                <div>
                                    <SalesDetailsChart/>
                                </div>
                            </div>
                        );
                    } else {
                        return <p>Loading...</p>
                    }
                }}

            </Query>
        );
    }
}

export default Dashboard;