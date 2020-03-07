import React, { Component, Fragment } from "react";
import {
  Tabs
} from "antd";
import { Link } from "react-router-dom";
import { Query, withApollo } from "react-apollo";
import ReactTable from "react-table";
import { GET_ALL_SELLERS } from "./Query/query";
import Loading from "./Utils/Loading";

const statusSymbol = value =>
  value ? (
    <div className="status status--success" />
  ) : (
    <div className="status" />
  );
  const {TabPane} = Tabs;

// TODO : Fix Columns MisMatch
const filterData = (data, type) => {
    console.log('datale',data);
    switch (type) {
        case 'approved': {
            return data.filter(
                seller => seller.approval.reviewed && seller.approval.approved 
            );
        }

        case 'pending': {
            return data.filter(
                seller => !seller.approval.reviewed 
            ); 
        }

        case 'rejected': {
            return data.filter(
                seller => seller.approval.reviewed && !seller.approval.approved
            );
        }
    }
    return data;
}
class Seller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      visible: false,
      filter: false
    };
    // this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleFilter = () => {
    this.setState(prevState => ({
      filter: !prevState.filter
    }));
  };

  render() {
    const columns = [
      {
        Header: "Image",
        accessor: "image",
        filterable: false,
        Cell: props => {
          return (
            <img style={{ width: "46%", margin: "0 27%" }} src={props.value} />
          );
        },
        minWidth: 150
      },
      {
        Header: "Name",
        accessor: "name",
        minWidth: 100,
        style: { textAlign: "center" },
        Cell: props => {
          return <div>{props.value}</div>;
        }
      },
      {
        Header: "Shop Name",
        accessor: "shopName",
        minWidth: 100,
        style: { textAlign: "center" }
      },
      {
        Header: "Email",
        accessor: "email",
        minWidth: 100,
        style: { textAlign: "center" }
      },
      {
        Header: "Mobile",
        accessor: "mobile",
        minWidth: 100,
        style: { textAlign: "center" }
      },

      // {
      //     Header: "Return",
      //     accessor: "returnAccepted",
      //     minWidth: 100,
      //     style: {textAlign: 'center'},
      //     Cell: props => {
      //         return statusSymbol(props.value)
      //     }
      // },
    ];
    const getTable = (data, str) => {
        const temp = filterData(data, str);
        return (
          <ReactTable
            columns={columns}
            data={temp}
            defaultPageSize={
              temp.length < 10
                ? temp.length === 0
                  ? 3
                  : temp.length
                : 10
            }
            resizable={true}
            sortable={false}
            filterable={this.state.filter}
            showPageSizeOptions={false}
          />
        );
      };
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <span className="page_heading">Sellers </span>
        </div>
        <span
          style={{ color: "blue", cursor: "pointer", fontSize: "14px" }}
          onClick={this.handleFilter}
        >
          Filter
        </span>
        <Query query={GET_ALL_SELLERS} refetchQueries={[GET_ALL_SELLERS]}>
          {({ loading, error, data }) => {
            if (loading) return <Loading />;
            return (
              <Tabs
                defaultActiveKey="1"
                size="default"
                style={{ textAlign: "center" }}
              >
                <TabPane tab="Approved" key="1">
                  {getTable(data.allSellers, "approved")}
                </TabPane>

                <TabPane tab="Pending" key="2">
                  {getTable(data.allSellers, "pending")}
                </TabPane>

                <TabPane tab="Rejected" key="3">
                  {getTable(data.allSellers, "rejected")}
                </TabPane>
              </Tabs>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default withApollo(Seller);
