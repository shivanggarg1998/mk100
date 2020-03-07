import React, {Component} from 'react';
import {Col, Row, Spin, Table} from "antd";
import {Query , withApollo} from 'react-apollo';
import ApprovalDialog from './ApprovalDialog';
import ReactTable from 'react-table';
import {GET_APPROVAL_PRODUCTS, HANDLE_APPROVAL} from './Query/query';
import Loading from './Utils/Loading';
import SellerDetails from "./SellerApproval/SellerDetails";
import ProductDetails from "./ProductApproval/ProductDetails";

const columns = [
    {
        Header: "Image",
        accessor: "origin.image",
        Cell: props => {
            return  <img style={{width: '46%', margin: '0 27%'}} src={props.value}/>
        },
        style: {textAlign: 'center'}
    },
    {
        Header: "Name",
        accessor: "origin.name",
        style: {textAlign: 'center'},
    },
    {
        Header: "Price",
        accessor: "origin.price",
        style: {textAlign: 'center'}
    },
    {
        Header: "Seller Name",
        accessor: "origin.seller",
        Cell: (props) => {
            return props.value.name;
        },
        style: {textAlign: 'center'}
    },
    {
        Header: "Seller Shopname",
        accessor: "origin.seller",
        Cell: (props) => {
            return props.value.shopName;
        },
        style: {textAlign: 'center'}
    },
    {
        Header: "Approve",
        accessor: "id",
        Cell: (props) => {
            return (
                <ApprovalDialog
                    handleApproval={
                        (s , client) => {
                            client.mutate({
                                mutation: HANDLE_APPROVAL,
                                variables: {
                                    "id": props.value,
                                    "comment": s.comment,
                                    "approved": s.yesModal
                                } ,
                                refetchQueries : [{query: GET_APPROVAL_PRODUCTS}]
                            }).then(
                                data => console.log("MUTATION", data)
                            );
                        }
                    }
                />
            );
        },
        style: {textAlign: 'center'}
    }
];

class ProductApproval extends Component {
    state = {
        filter: false
    }

    handleFilter = () => {
        this.setState(
            prevState => ({
                filter: !prevState.filter
            })
        );
    }

    render() {
        return (
            <div>
                <h1>Product Approvals</h1>
                <span 
                    style={{color: 'blue', cursor: 'pointer', fontSize: '14px'}}
                    onClick={this.handleFilter}
                >
                    Filter
                </span>
                <Query query={GET_APPROVAL_PRODUCTS} fetchPolicy={'cache-and-network'}>
                    {({loading, error, data}) => {
                        if (loading)
                            return (
                                <Loading />
                            );
                        // console.log(data.getProductApproval);
                        return ( 
                            <ReactTable 
                                columns={columns}
                                data={data.getProductApproval}
                                defaultPageSize={data.getProductApproval.length < 10 ? data.getProductApproval.length === 0 ? 3 : data.getProductApproval.length : 10}
                                resizable={true}
                                sortable={false}
                                noDataText="No Data"
                                filterable={this.state.filter}
                                showPageSizeOptions={false}
                                SubComponent={row => <ProductDetails product={row.original.origin.id}/>}
                            />
                        );
                    }}
                </Query>
            </div>
        );
    }
}

export default withApollo(ProductApproval);