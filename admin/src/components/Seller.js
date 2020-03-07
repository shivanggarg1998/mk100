import React, { Component } from 'react';
import { Spin, Table, Col, Row } from "antd";
import { Query } from 'react-apollo';
import { GET_ALL_SELLERS } from './Query/query';

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    align: "center",
    render: value => <img style={{width: '80px'}} src={value} />
  },
  {
    title: "Shop Name",
    dataIndex: "shopName",
    key: "shopName",
    align: "center"
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    align: "center"
  },
  {
    title: "About",
    dataIndex: "about",
    key: "about",
    align: "center"
  }
];

class Seller extends Component {
    render() {
        return (
            <div>
                <h1>Sellers</h1>
                <Query query={GET_ALL_SELLERS}>
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
                            dataSource={data.allSellers} 
                            expandedRowRender={record => (
                                <Row>
                                    <Col span={6} offset={2}>
                                        <img
                                            src={record.image} alt=""
                                            style={{width: '100%', padding: "0 20px 20px 20px"}}/>
                                    </Col>
                                    <Col span={14}>
                                        <h2>{record.name}</h2>
                                        <h3>{record.shopName}</h3>
                                        <p>{record.about}</p>
                                    </Col>
                                </Row>
                            )}
                            columns={columns} 
                        />;
                    }}
                </Query>
            </div>
        )
    }
}

export default Seller;