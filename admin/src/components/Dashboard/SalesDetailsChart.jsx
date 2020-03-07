import React, {Component} from 'react';
import {Card, Col, List, Row, Tabs} from 'antd';
import {Axis, Chart, Geom, Legend, Tooltip} from 'bizcharts';
import {GET_REVENUE_MONTH} from "../Query/query";
import ChartCard from "./ChartCard";
import {Query} from "react-apollo";

const TabPane = Tabs.TabPane;

const listData = [
    {
        title: 'Order #1',
    }, {
        title: 'Order #2',
    }, {
        title: 'Order #3',
    }, {
        title: 'Order #4',
    },
];

// 数据源
const data = [
    {genre: 'Sports', sold: 275, income: 2300},
    {genre: 'Strategy', sold: 115, income: 667},
    {genre: 'Action', sold: 120, income: 982},
    {genre: 'Shooter', sold: 350, income: 5271},
    {genre: 'Other', sold: 150, income: 3710},
    {genre: 'Other1', sold: 520, income: 3710},
    {genre: 'Other2', sold: 120, income: 3710},
    {genre: 'Other33', sold: 350, income: 3710},
    {genre: 'Ot3her3', sold: 350, income: 3710},
    {genre: 'Oth3er3', sold: 350, income: 3710},
    {genre: 'Othe3r5', sold: 150, income: 3710},
    {genre: 'Other5', sold: 150, income: 3710},
    {genre: 'Other4', sold: 180, income: 3710}
];


const chartRowResponsive = {
    xs: 24,
    sm: 24,
    md: 24,
    style: {marginBottom: 24},
};


const padding = [40, 30, 30, 30];


class SalesDetailsChart extends Component {
    render() {
        return (
            <Card>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Sales" key="1">
                        <p>
                            <strong>Store Sales Trend</strong>
                        </p>
                        <Query query={GET_REVENUE_MONTH}>
                            {({data, loading}) => {
                                if (loading) {
                                    return <ChartCard loading={true}/>;
                                }
                                data = data.getRevenuePerMonthAdmin;
                                let totalSales = 0;
                                data.forEach(item => {
                                    totalSales += item.sales;
                                });

                                return (
                                    <Chart
                                        forceFit={true}
                                        data={data}
                                        padding={padding}
                                    >
                                        <Axis name="Date"/>
                                        <Axis name="Sales"/>
                                        <Legend position="top" dy={-20}/>
                                        <Tooltip/>
                                        <Geom type="interval" position="date*sales"/>
                                    </Chart>
                                );
                            }}

                        </Query>
                    </TabPane>
                </Tabs>
            </Card>
        );
    }
}


export default SalesDetailsChart;
