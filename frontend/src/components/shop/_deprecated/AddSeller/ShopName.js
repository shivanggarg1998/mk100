import React from 'react';
import {Input} from "antd";
import ApolloClient, { gql } from 'apollo-boost';
import {withApollo} from 'react-apollo';

const Search = Input.Search;

class ShopName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            available: undefined,
            shopName: ""
        }
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleCheck(shopName) {
        console.log("Handle check called", shopName);
        client.query({
            query: gql`
                query {
                    checkShopnameAvailability(shopName: "${shopName}")
                }            
            `
        }).then(
            data => {
                this.setState(
                    () => {
                        return {
                            shopName: shopName,
                            available: data.data.checkShopnameAvailability
                        }
                    }
                )
            }
        )
    }

    componentWillUnmount() {
        this.props.onNext(this.state.shopName)
    }

    render() {
        return (
            <div>
                <div className="page_title">
                    <h2>Choose your shop name</h2>
                    <p>Choose a memorable name that reflects your style.</p>
                </div>
                <div className="page_content">
                    <div className="container_80">
                        <Search
                            placeholder="Choose a Shop Name"
                            enterButton="Check"
                            size="large"
                            onSearch={value => this.handleCheck(value)}
                            defaultValue={this.props.shopName}
                        />
                        <p id="message">{this.state.available === undefined ? "" : this.state.available ? "Available" : "Not Available"}</p>
                        <p>Shop names must have 4–20 characters and should not contain spaces.</p>
                    </div>
                </div>
            </div>
        );
    }
};

export default withApollo(ShopName);