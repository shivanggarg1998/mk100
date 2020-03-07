import React, {Component} from 'react';
import {Query} from 'react-apollo';
import {gql} from 'apollo-boost';
import OrderListCard from './OrderListCard';
import {GET_ORDER_BY_USER} from "../../query";


class Order extends Component {
    render() {
        return (
            <div>
                <Query query={GET_ORDER_BY_USER}>
                    {({loading, data, error}) => {
                        if (loading) {
                            return <p>Loading...</p>;
                        }
                        if (error) {
                            console.error(error);
                        }

                        data = data.getOrdersByUser;
                        console.log(data);

                        return (
                            <div className="bg-grey">
                                <div className="max_width_980">
                                    <div className="cart_title">
                                        <h1>Your Orders</h1>
                                    </div>
                                    {
                                        data.map(
                                            (order, index) => <OrderListCard order={order} key={index}
                                                                             history={this.props.history}/>
                                        )
                                    }
                                </div>
                            </div>
                        );
                    }}
                </Query>
            </div>
        );
    }
}

export default Order;