import React, {Component} from 'react';
import {Table, Card} from 'antd' ;
import {withApollo} from 'react-apollo';
import {gql} from 'apollo-boost';


const trackingColumns = [{
    title: 'Date/Time',
    dataIndex: 'datetime',
    key: 'datetime',
}, {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
}, {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
}, {
    title: 'Comments',
    dataIndex: 'comments',
    key: 'comments',
}];

const GET_TRACKING_DETAILS = gql`
query($orderID: ID!, $productID: ID!) {
  getShipmentTrackingDetails(
    orderID: $orderID
    productID: $productID
  )
}
`;

class ProductTracking extends Component {

    state = {
        tracking: undefined
    };

    componentWillMount() {
        this.props.client.query({
            query: GET_TRACKING_DETAILS,
            variables: {
                orderID: this.props.order_id,
                productID: this.props.product_id
            }
        }).then(
            ({data, loading}) => {
                if (!loading) {
                    data = data.getShipmentTrackingDetails;
                    this.setState({tracking: data});
                    console.log(data);
                }
            }
        );
    }


    render() {
        return (
            <div>
                {this.state.tracking && (
                    <Card>
                        <h4>Delivery Tracking</h4>
                        <Table
                            dataSource={this.state.tracking.trackingEvents}
                            columns={trackingColumns}
                            pagination={false}
                        />
                    </Card>
                )}
                {!this.state.tracking && (
                    <Card loading={true}/>
                )}
            </div>
        );
    }
}

ProductTracking.propTypes = {};

export default withApollo(ProductTracking);