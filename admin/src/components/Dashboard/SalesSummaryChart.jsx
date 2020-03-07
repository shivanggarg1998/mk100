import React, {Component} from 'react';
import ChartCard from "./ChartCard";
import {Chart, Geom, Tooltip} from "bizcharts";
import {Query} from 'react-apollo';
import {GET_REVENUE} from "../Query/query";

const padding = [10, 5, 5, 5];

class SalesSummaryChart extends Component {
    render() {
        return (
            <Query query={GET_REVENUE}>
                {({data, loading}) => {
                    if (loading) {
                        return <ChartCard loading={true}/>;
                    }
                    data = data.getRevenuePerWeekAdmin;
                    let totalSales = 0;
                    data.forEach(item => {
                        totalSales += item.sales;
                    });

                    return (
                        <ChartCard
                            title={'Sales Summary'}
                            tooltip={'Sales Summary For Products'}
                            stat={`Rs. ${totalSales}`}
                            footer={'Day Sales : Rs. ' + data[data.length - 1].sales}
                        >
                            <Chart
                                height={100}
                                forceFit={true}
                                data={data}
                                padding={padding}
                            >
                                <Tooltip/>
                                <Geom type="interval" position="date*sales"/>
                            </Chart>
                        </ChartCard>
                    );
                }}

            </Query>
        );
    }
}

SalesSummaryChart.propTypes = {};

export default SalesSummaryChart;
