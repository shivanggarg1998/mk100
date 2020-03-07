import React, {Component} from 'react';
import {Spin, Table, Col, Row, Tag, Icon} from "antd";
import {Query, withApollo} from 'react-apollo';
import ApprovalDialog from './ApprovalDialog';
import {GET_APPROVAL_SELELRS, HANDLE_APPROVAL} from './Query/query';
import ReactTable from 'react-table';
import Loading from './Utils/Loading';
import SellerDetails from "./SellerApproval/SellerDetails";

const columns = [
    {
        Header: "Image",
        accessor: "origin.image",
        Cell: props => <img style={{width: '100%', padding: '5px' , maxWidth : 100}} src={props.value}/>,
        style: {textAlign: 'center'}
    },
    {
        Header: "Name",
        accessor: "origin.name",
        style: {textAlign: 'center'},
    },
    {
        Header: "Shopname",
        accessor: "origin.shopName",
        style: {textAlign: 'center'}
    },
    {
        Header: "About",
        accessor: "origin.about",
        Cell: props => <div dangerouslySetInnerHTML={{__html: props.value}}/>,
        style: {textAlign: 'center'}
    },
    {
        Header: "Approve",
        accessor: "id",
        Cell: props => {
            return (
                <ApprovalDialog
                    handleApproval={
                        (s, client) => {
                            client.mutate({
                                mutation: HANDLE_APPROVAL,
                                variables: {
                                    "id": props.value,
                                    "comment": s.comment,
                                    "approved": s.yesModal
                                },
                                refetchQueries: [{query: GET_APPROVAL_SELELRS}]
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

class SellerApproval extends Component {
    state = {
        comment: '',
        yesModal: false,
        noModal: false
    };

    handleFilter = () => {
        this.setState(
            prevState => ({
                filter: !prevState.filter
            })
        );
    };

    render() {
        return (
            <div>
                {/*<SellerDetails seller={"verify"}/>*/}

                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                <h1>Seller Approvals</h1>
                <span
                    style={{color: 'blue', cursor: 'pointer', fontSize: '14px'}}
                    onClick={this.handleFilter}
                >
                    Filter
                </span>
                <Query query={GET_APPROVAL_SELELRS} fetchPolicy={'cache-and-network'}>
                    {({loading, error, data}) => {
                        if (loading)
                            return (
                                <Loading/>
                            );
                        // console.log(data);
                        return (
                            <ReactTable
                                columns={columns}
                                data={data.getSellerApproval}
                                defaultPageSize={data.getSellerApproval.length < 10 ? data.getSellerApproval.length === 0 ? 3 : data.getSellerApproval.length : 10}
                                resizable={true}
                                sortable={false}
                                noDataText="No Data"
                                filterable={this.state.filter}
                                showPageSizeOptions={false}
                                SubComponent={row => <SellerDetails seller={row.original.origin.shopName}/>}
                            />
                        );
                    }}
                </Query>
            </div>
        );
    }
}

export default SellerApproval;