import React, { Component } from 'react';
import { Spin, Table, Row, Col } from "antd";
import { Query } from 'react-apollo';
import { GET_ALL_ORDERS } from './Query/query';

const statusSymbol = value =>
    value ? (
        <div className = "status status--success" />
    ) : (
        <div className = "status" />
    );

const Title = () => (
    <div>
        <Row>Products</Row>
        <hr style={{border: "solid 0.5px rgb(230,230,230)"}}/>
        <Row>
            <Col span={7}>Image</Col>
            <Col span={7}>Name</Col>
            <Col span={6}>SelectedSize</Col>
            <Col span={4}>Quantity</Col>
        </Row>
    </div>
)

const columns = [
    {
        title: <Title />,
        dataIndex: "products",
        key: "products",
        align: "center",
        width: 500,
        render: (products, index) => {
            return (
                <div>
                    
                {
                    products.map(
                        (item,index) => {
                            return (
                                <Row key={index} style={{marginTop: '10px'}}>
                                    <Col span={7}><img style={{width: '80px'}} src={item.product.image} /></Col>
                                    <Col span={7}>{item.product.name}</Col>
                                    <Col span={6}>{item.itemCount}</Col>
                                    <Col span={4}>{item.selectedSize}</Col>
                                </Row> 
                            )
                        }
                    )
                }   
                </div> 
            );
        }
    },
    {
        title: "User",
        dataIndex: "user",
        key: "user",
        align: "center",
        render: value => <p>{value.username}</p>
    },
    {
        title: "Shipping",
        dataIndex: "shipping",
        key: "shipping",
        align: "center",
        render: value => {
            value = value.address;
            return <p>{value.address}, {value.street}, {value.city}, {value.state}, {value.zipcode}</p>
        }
    },
    {
        title: "Confirmed",
        dataIndex: "status.confirmed",
        key: "confirmed",
        align: "center",
        render: value => statusSymbol(value)
    },
    {
        title: "Packed",
        dataIndex: "status.packed",
        key: "packed",
        align: "center",
        render: value => statusSymbol(value)
    },
    {
        title: "Shipped",
        dataIndex: "status.shipped",
        align: "center",
        key: "shipped",
        render: value => statusSymbol(value)
    },
    {
        title: "Delivered",
        dataIndex: "status.delivered",
        key: "delivered",
        align: "center",
        render: value => statusSymbol(value)
    },
    {
        title: "Payment Mode",
        dataIndex: "payment.mode",
        key: "mode",
        align: "center",
    },
    {
        title: "Payment Status",
        dataIndex: "payment.status",
        key: "status",
        align: "center",
    },
]

class User extends Component {
    render() {
        return (
            <div>
                <h1>Orders</h1>
                <Query query={GET_ALL_ORDERS}>
                    {({ loading, error, data }) => {
                        if (loading)
                          return (
                              <Table
                                  dataSource={[]}
                                  locale={{ emptyText: <Spin size="large" /> }}
                                  columns={columns}
                              />
                          );
                        if (error)
                            return (
                                <Table
                                    dataSource={[]}
                                    locale={{ emptyText: "connection error" }}
                                    columns={columns}
                                />
                            );
                        return <Table 
                            dataSource={data.allOrders} 
                            columns={columns} 
                        />;
                    }}
                </Query>
            </div>
        )
    }
}

export default User;