import React, {Component, Fragment} from 'react';
import {Spin, Table, Button, Tag, Icon, Input, Modal, Popconfirm, message, Row, Col} from "antd";
import {Link} from 'react-router-dom';
import {Query, withApollo} from 'react-apollo';
import { GET_ALL_USERS } from './Query/query';


// TODO : Fix Columns MisMatch

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            visible: false
        };
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleSearch = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({searchText: selectedKeys[0]});
    };

    handleReset = clearFilters => () => {
        clearFilters();
        this.setState({searchText: ''});
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {

        const columns = [
            {
                title: "Image",
                dataIndex: "image",
                key: "image",
                render: value => <img style={{width: '80px'}} src={value}/>,
                align: "center",
                width: 150,
                // fixed : "left"

            },
            {
                title: "Username",
                dataIndex: "username",
                key: "username",
                width: 200,
                align: "center"
            },
            {
                title: "Name",
                // dataIndex: "name",
                key: "name",
                width: 300,
                align: "center",
                filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                    <div className="custom-filter-dropdown">
                        <Input
                            ref={ele => this.searchInput = ele}
                            placeholder="Search name"
                            value={selectedKeys[0]}
                            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                            onPressEnter={this.handleSearch(selectedKeys, confirm)}
                        />
                        <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>Search</Button>
                        <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
                    </div>
                ),
                filterIcon: filtered => <Icon type="filter" style={{color: filtered ? '#108ee9' : '#aaa'}}/>,
                onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        });
                    }
                },
                render: (product) => {
                    const {searchText} = this.state;
                    const xyz = searchText ? (
                        <span>
                            {product.name.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
                                fragment.toLowerCase() === searchText.toLowerCase()
                                    ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                            ))}
                        </span>
                    ) : product.name;

                    return <Link to={`/product/${product.id}/view`}>{xyz}</Link>;


                }
            },
            {
                title: "About",
                dataIndex: "about",
                key: "about",
                width: 200,
                align: "center"
            },
            {
                title: "Followers",
                dataIndex: "followers",
                key: "followers",
                width: 200,
                align: "center",
                render: arr => arr.length
            },
            {
                title: "Following",
                dataIndex: "following",
                key: "following",
                width: 200,
                align: "center",
                render: arr => arr.length
            },
            {
                title: "Following Shop",
                dataIndex: "followingShop",
                key: "followingShop",
                width: 200,
                align: "center",
                render: arr => arr.length
            },
        ];

        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <span className='page_heading'>Users</span>
                </div>
                <Query
                    query={GET_ALL_USERS}
                >
                    {({loading, error, data}) => {
                        if (loading)
                            return (
                                <Table
                                    dataSource={[]}
                                    locale={{emptyText: <Spin size="large"/>}}
                                    columns={columns}
                                />
                            );
                        if (error)
                            return (
                                <Table
                                    dataSource={[]}
                                    locale={{emptyText: "connection error"}}
                                    columns={columns}
                                />
                            );
                        return (
                            <Table
                                dataSource={data.allUsers}
                                rowKey="id"
                                className={'custom_products_table'}
                                // style={{backgroundColor : 'white' }}
                                scroll={{x: 1200, y: 800}}
                                bordered
                                columns={columns}
                            />
                        );
                    }}
                </Query>
            </div>
        );
    }
}

export default withApollo(User);