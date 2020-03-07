import React, {Component, Fragment} from 'react';
import {Spin, Table, Button, Tag, Icon, Input, Modal, Popconfirm, message, Row, Col} from "antd";
import {Link} from 'react-router-dom';
import {Query, withApollo} from 'react-apollo';
import ReactTable from 'react-table';
import {GET_ALL_PRODUCTS, REMOVE_PRODUCT} from './Query/query';
import Loading from "./Utils/Loading";

const statusSymbol = value =>
    value ? (
        <div className="status status--success"/>
    ) : (
        <div className="status"/>
    );


// TODO : Fix Columns MisMatch

class Product extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            visible: false,
            filter: false
        };
        this.handleOk = this.handleOk.bind(this);
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

    handleOk = (id) => {
        console.log(id);
        this.props.client.mutate({
            mutation: REMOVE_PRODUCT,
            variables: {id: id},
            refetchQueries: [{query: GET_ALL_PRODUCTS}]
        }).then(
            data => {
                data = data.data.removeProduct;
                if (data) {
                    console.log(data);
                    message.info("Product deleted");
                } else {
                    message.error("There was some problem, try again later.");
                }
            }
        );
    };

    handleFilter = () => {
        this.setState(
            prevState => ({
                filter: !prevState.filter
            })
        );
    }

    render() {

        // const columns = [
        //     {
        //         title: "Image",
        //         dataIndex: "image",
        //         key: "image",
        //         render: value => <img style={{width: '80px'}} src={value}/>,
        //         align: "center",
        //         width: 150,
        //         // fixed : "left"

        //     },
        //     {
        //         title: "Name",
        //         // dataIndex: "name",
        //         key: "name",
        //         width: 300,
        //         align: "center",
        //         filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
        //             <div className="custom-filter-dropdown">
        //                 <Input
        //                     ref={ele => this.searchInput = ele}
        //                     placeholder="Search name"
        //                     value={selectedKeys[0]}
        //                     onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //                     onPressEnter={this.handleSearch(selectedKeys, confirm)}
        //                 />
        //                 <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>Search</Button>
        //                 <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
        //             </div>
        //         ),
        //         filterIcon: filtered => <Icon type="filter" style={{color: filtered ? '#108ee9' : '#aaa'}}/>,
        //         onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
        //         onFilterDropdownVisibleChange: (visible) => {
        //             if (visible) {
        //                 setTimeout(() => {
        //                     this.searchInput.focus();
        //                 });
        //             }
        //         },
        //         render: (product) => {
        //             const {searchText} = this.state;
        //             const xyz = searchText ? (
        //                 <span>
        //                     {product.name.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
        //                         fragment.toLowerCase() === searchText.toLowerCase()
        //                             ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
        //                     ))}
        //                 </span>
        //             ) : product.name;

        //             return <Link to={`/product/${product.id}/view`}>{xyz}</Link>;


        //         }
        //     },
        //     {
        //         title: "Price",
        //         dataIndex: "price",
        //         key: "price",
        //         width: 200,
        //         align: "center"
        //     },
        //     {
        //         title: "Sizes",
        //         dataIndex: "sizes",
        //         key: "sizes",
        //         width: 200,
        //         render: value => {
        //             return value.map((v, index) => (<Tag key={index}>{v}</Tag>));
        //         },
        //         align: "center"
        //     },
        //     {
        //         title: "COD",
        //         dataIndex: "codAccepted",
        //         key: "codAccepted",
        //         width: 200,
        //         render: value => statusSymbol(value),
        //         align: "center"
        //     },
        //     {
        //         title: "Return",
        //         dataIndex: "returnAccepted",
        //         key: "returnAccepted",
        //         width: 200,
        //         render: value => {
        //             // console.log(value);
        //             return statusSymbol(value);
        //         },
        //         align: "center"
        //     },
        //     {
        //         title: "Actions",
        //         key: "id",
        //         width: 250,
        //         render: product => {

        //             let a = product.id;

        //             return (
        //                 <div>
        //                     <Popconfirm 
        //                         title="Are you sure delete this task?"
        //                         placement={'leftTop'}
        //                         onConfirm={() => this.handleOk(product.id)} 
        //                         okText="Yes" 
        //                         cancelText="No"
        //                     >
        //                         <span style={{cursor: 'pointer', color: 'blue'}}> Delete </span>
        //                     </Popconfirm>,
        //                 </div>
        //             );
        //         },
        //         align: "center"
        //     },

        // ];

        const columns = [
            {
                Header: "Image",
                accessor: "image",
                Cell: props => {
                    return  <img style={{width: '46%', margin: '0 27%'}} src={props.value}/>
                },
                minWidth: 150
            },
            {
                Header: "Name",
                accessor: "name",
                minWidth: 100,
                style: {textAlign: 'center'},
                Cell: props => {
                    return <Link to={`/product/${props.original.id}/view`}>{props.value}</Link>;
                }
            },
            {
                Header: "Price",
                accessor: "price",
                minWidth: 100,
                style: {textAlign: 'center'}
            },
            {
                Header: "Sizes",
                accessor: "sizes",
                minWidth: 150,
                style: {textAlign: 'center'},
                Cell: props => {
                    if (props.value.length > 0) {
                        return props.value.map((v, index) => (<Tag key={index}>{v}</Tag>));
                    }
                    return "-"
                }
            },
            {
                Header: "COD",
                accessor: "codAccepted",
                minWidth: 100,
                style: {textAlign: 'center'},
                Cell: props => {
                    return statusSymbol(props.value)
                }
            },
            {
                Header: "Return",
                accessor: "returnAccepted",
                minWidth: 100,
                style: {textAlign: 'center'},
                Cell: props => {
                    return statusSymbol(props.value)
                }
            },
            {
                Header: "Actions",
                filterable:false,
                minWidth: 200,
                style: {textAlign: 'center'},
                Cell: props => {
                    let product = props.original;
                    console.log(product);
                    return (
                        <div>
                            <Popconfirm 
                                title="Are you sure delete this task?"
                                placement={'leftTop'}
                                onConfirm={() => this.handleOk(product.id)} okText="Yes" cancelText="No"
                            >
                                <span style={{cursor: 'pointer', color: 'blue'}}> Delete </span>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ];

        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <span className='page_heading'>Products </span>
                </div>
                <span 
                    style={{color: 'blue', cursor: 'pointer', fontSize: '14px'}}
                    onClick={this.handleFilter}
                >
                    Filter
                </span>
                <Query
                    query={GET_ALL_PRODUCTS}
                    refetchQueries={[GET_ALL_PRODUCTS]}
                >
                    {({loading, error, data}) => {
                        if (loading)
                            return (
                                <Loading />
                            );
                        return (
                            <ReactTable 
                                columns={columns}
                                data={data.allProducts}
                                defaultPageSize={data.allProducts.length < 10 ? data.allProducts.length === 0 ? 3 : data.allProducts.length : 10}
                                resizable={true}
                                sortable={false}
                                filterable={this.state.filter}
                                showPageSizeOptions={false}
                            />
                        )
                    }}
                </Query>
            </div>
        );
    }
}

export default withApollo(Product);