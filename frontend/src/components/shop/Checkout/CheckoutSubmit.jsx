import React, {Component} from 'react';
import {Button} from 'antd';
import {withApollo} from 'react-apollo';
import {GET_ENC_REQUEST} from "../../query";

class CheckoutSubmit extends Component {

    state = {
        order: {}
    };

    constructor(props) {
        super(props);
        this.handleRedirect = this.handleRedirect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.redirectToCCAvenue = this.redirectToCCAvenue.bind(this);
        this.ccavenueForm = React.createRef();
    }

    componentWillMount() {
        console.log("Sate Route : ", this.props.location.state);
        if (this.props.location.state) {
            let {order} = this.props.location.state;
            if (order) {
                this.setState({
                    order
                });
            } else {
                this.props.history.push('/cart');
            }
        } else {
            this.props.history.push('/cart');
        }
    }

    redirectToCCAvenue() {
        let id = this.state.order.id;
        this.props.client.mutate({
            mutation: GET_ENC_REQUEST,
            variables: {
                orderID: id
            }
        }).then(({data}) => {
            data = data.getEncryptedRequest;
            this.setState({
                ...data,
            });
            // this.handleSubmit();
            this.ccavenueForm.current.submit();
        });


    }


    handleSubmit() {
        fetch("https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction", {
            method: "POST",
            body: `encRequest=${this.state.encRequest}&access_code=${this.state.access_code}`,
            mode: "no-cors"
        }).then(this.handleRedirect);
    }

    handleRedirect(res) {
        console.log(res);
        if (res.status === 200) {
            // redirect here
            // window.location.href = 'http://localhost:300/redirect';
        } else {
            // Something went wrong here
        }

    }

    render() {
        return (
            <div className='max_width_640'>
                <div className="cart_content">
                    <div className="order_submit">
                        <h3>Order Has Been Placed Successfully</h3>
                        <h3>Order Number : {this.state.order.order_number}</h3>
                        <p>Pay to Confirm Order</p>
                        <Button type='submit' className='theme_button'
                                onClick={this.redirectToCCAvenue}>Pay {this.state.order.total}</Button>

                        <form ref={this.ccavenueForm}
                              action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"
                              method='post'>
                            <input type="hidden" value={this.state.encRequest} name='encRequest'/>
                            <input type="hidden" value={this.state.access_code} name='access_code'/>

                        </form>

                    </div>
                </div>
            </div>
        );
    }
}

CheckoutSubmit.propTypes = {};

export default withApollo(CheckoutSubmit);
