import React, {Component} from 'react';
import ChartCard from "./ChartCard";
import {Query} from 'react-apollo';
import {Chart, Geom, Tooltip} from "bizcharts";
import {Skeleton} from 'antd';
import {GET_ACTIVE_USER_BY_SELLER} from "../Query/query";

const padding = [10, 5, 5, 5];

class UniqueUsersChart extends Component {
    render() {
        // return <h1>HELLO</h1>
        return (
            <Query query={GET_ACTIVE_USER_BY_SELLER}>
                {
                    ({data, loading}) => {
                        if (loading) {
                            return <ChartCard loading={true}/>;
                        }
                        console.log(data);
                        data = data.getActiveUsersLastWeekBySeller;
                        let totalUser = 0;
                        data.forEach(item => {
                            totalUser += item.users;
                        });

                        return (
                            <ChartCard
                                title={'Unique Visitors'}
                                tooltip={'Unique Visitors Last Week'}
                                stat={totalUser}
                                footer={'Today : ' + data[data.length - 1].users}

                            >
                                <Chart
                                    height={100}
                                    forceFit={true}
                                    data={data}
                                    padding={padding}
                                >
                                    <Tooltip/>
                                    <Geom type="interval" position="date*users"/>
                                </Chart>
                            </ChartCard>
                        );
                    }
                }

            </Query>
        );
    }
}

UniqueUsersChart.propTypes = {};

export default UniqueUsersChart;
