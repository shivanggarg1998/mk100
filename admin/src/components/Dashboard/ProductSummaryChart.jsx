import React, {Component} from 'react';
import ChartCard from "./ChartCard";
import {Chart, Geom, Tooltip} from "bizcharts";
import {Query} from 'react-apollo';
import {GET_PRODUCT} from "../Query/query";

const padding = [10, 5, 5, 5];

class ProductSoldSummaryChart extends Component {
    state = {
        loading: true
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 1000);
    }

    render() {
        return (
            <Query query={GET_PRODUCT}>
                {({data, loading}) => {
                    if (loading) {
                        return <ChartCard loading={true}/>;
                    }
                    data = data.getProductsPerWeekAdmin;
                    let totalSales = 0;
                    data.forEach(item => {
                        totalSales += item.products;
                    });

                    return (
                        <ChartCard
                            loading={this.state.loading}
                            title={'Product Sold Summary'}
                            tooltip={'Product Sold in Week'}
                            stat={`${totalSales} items`}
                            footer={'Today : ' + data[data.length - 1].products + ' sold'}
                        >
                            <Chart
                                height={100}
                                forceFit={true}
                                data={data}
                                padding={padding}
                            >
                                <Tooltip/>
                                <Geom type="interval" position="date*products"/>
                            </Chart>
                        </ChartCard>
                    );
                }}

            </Query>
        );
    }
}

ProductSoldSummaryChart.propTypes = {};

export default ProductSoldSummaryChart;
