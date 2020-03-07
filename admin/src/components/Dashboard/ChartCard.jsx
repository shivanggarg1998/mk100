import React, {Component} from 'react';
import {Card, Divider, Icon, Tooltip} from 'antd';


class ChartCard extends Component {
    render() {

        const {title, tooltip, stat, footer , loading} = this.props;
        return (
            <div>
                <Card className='chart-card' loading={loading}>

                    <div className="chart-card_header">
                        <div className="chart-card_title">
                            {title}
                        </div>
                        <div className="chart-card_info">
                            <Tooltip title={tooltip}>
                                <Icon type={'info'}/>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="chart-card_body">
                        <div className="chart-card_stat">
                            {stat}
                        </div>
                        <div className="chart-card_chart">
                            {this.props.children}
                        </div>
                    </div>
                    <Divider style={{margin: '10px 0'}}/>
                    <div className="chart-card_footer">
                        {footer}
                    </div>

                </Card>

            </div>
        );
    }
}

export default ChartCard;
