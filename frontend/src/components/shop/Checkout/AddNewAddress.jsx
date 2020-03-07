import React, {Component} from 'react';
import PropTypes from 'prop-types';

// TODO : Replace Form to ANTD and use addUserAddress Mutation to Add Address
// TODO : And Refetch getUserAddresses

class AddNewAddress extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        let address = e.target[0].value;
        let street = e.target[1].value;
        let city = e.target[2].value;
        let state = e.target[3].value;
        let zip = e.target[4].value;

        console.log(address, street, city, state, zip);
    };


    render() {
        return (
            <div className='form_content'>
                <form
                    className="checkout_form"
                >
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address"/>

                    <label htmlFor="street">Street</label>
                    <input type="text" id="street" name="street"/>

                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city"/>

                    <label htmlFor="name">State</label>
                    <input type="text" id="state" name="state"/>

                    <label htmlFor="pin">Zip</label>
                    <input type="number" id="zip" name="zip"/>

                    <button type="submit" className="submit_btn">Submit</button>
                </form>
            </div>
        );
    }
}

AddNewAddress.propTypes = {};

export default AddNewAddress;
