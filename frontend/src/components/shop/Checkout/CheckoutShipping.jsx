import React from 'react';
import {Query} from 'react-apollo';
import {Button, Divider, Icon} from 'antd';
import {GET_USER_ADDRESS} from "../../query";
import {ModalRoute} from 'react-router-modal';
import {Link} from 'react-router-dom';
import AddNewAddress from "./AddNewAddress";

class CheckoutShipping extends React.Component {

    handleShipHere = (address) => {
        console.log(address);
        this.props.history.push({
            pathname: '/checkout/review',
            state: {
                address
            }
        });
    };

    render() {
        const {match} = this.props;
        return (
            <div>
                <Query query={GET_USER_ADDRESS}>
                    {({data, error, loading}) => {
                        if (loading) {
                            return "Fetching";
                        }
                        return (

                            <div className="bg-grey">
                                <div className="max_width_640 checkout_container">


                                    <div className="form_content">
                                        <div className="form_title">
                                            <h3>Choose a Shipping Address</h3>
                                        </div>
                                        <Divider/>
                                        {
                                            data.getUserAddresses.map(address => {
                                                return (
                                                    <div key={address.id} className='form_address_container'>
                                                        <div className="form_address">
                                                            {/*<div className="address_checkbox">*/}
                                                            {/*<div>*/}
                                                            {/*<Checkbox value={address.id}/>*/}
                                                            {/*</div>*/}

                                                            {/*</div>*/}
                                                            <div className="address_content">
                                                                {address.address} , {address.street} <br/>
                                                                {address.city} , {address.state} <br/>
                                                                {address.zipcode}
                                                            </div>
                                                            <div className="address_btn_group">
                                                                <Button className='theme_button' onClick={() => {this.handleShipHere(address)}}>
                                                                    Ship Here
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <Divider/>
                                                    </div>
                                                );
                                            })
                                        }
                                        <div className='add_new_address'>
                                            <Button className='theme_button'>
                                                <Link to={`${match.url}/new`}>
                                                    <Icon type='plus'/> Add New Shipping Address
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <p style={{paddingBottom: '10px', textAlign: 'center'}}>For help, contact us.</p>
                            </div>
                        );
                    }}
                </Query>
                <ModalRoute
                    path={`${match.url}/new`}
                    parentPath={match.url}
                    component={AddNewAddress}
                    className={'react-router-modal__modal max_width_500'}
                />
            </div>

        );
    }
}

export default CheckoutShipping;