import React from 'react';
import {Progress, Input} from 'antd';
import ApolloClient, {gql} from 'apollo-boost';

import ShopName from "./ShopName";
import SellerDetails from './SellerDetails';
import ShopDetails from './ShopDetails';
import ShopPolicy from './ShopPolicy';

// const client = new ApolloClient({
//     uri: "http://localhost:4000"
// });

class AddSeller extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: 25,
            page: 0,
            shopName: "",
            name: "",
            image: "",
            password:"",
            about: "",
            intro:"",
            address: "",
            street: "",
            city: "",
            state: "",
            zipcode: "",
            aadhar: null,
            pan: null,
            account: null,
            gst: null,
            returnPolicy: "",
            storePolicy: ""
        }
    }

    submitDetails = () => {
        console.log(this.state);
        let {shopName, name, image, about, address, street, city, state, zipcode, aadhar, pan, account, gst, returnPolicy, storePolicy,intro} = this.state;
        client.mutate({
            mutation: gql `
                mutation {
                    addSeller(
                        input:{
                            name: "${name}",
                            shopName: "${shopName}",
                            image: "${image}",
                            about: "${about}",
                            intro: "${intro}"
                            address:{
                                address: "${address}",
                                street: "${street}",
                                city: "${city}",
                                state: "${state}",
                                zipcode: ${zipcode}
                            },
                            legalInfo:{
                                pan: "${pan}",
                                aadhar: "${aadhar}",
                                gst: "${gst}",
                                bank: "${account}"
                            },
                            policy:{
                                store: "${storePolicy}",
                                return: "${returnPolicy}"
                            }
                        }) {
                            name
                            image
                            id
                            about
                            shopName
                            address {
                                address
                                street
                                city
                                state
                                zipcode
                            }
                            legalInfo {
                                pan
                                aadhar
                                gst
                                bank
                            }
                            policy {
                                store
                                return
                            }
                        }
                    }         
            `
        }).then(
            data => this.props.history.push(`/seller/${this.state.shopName}`)
        )
    }

    onContinue = () => {
        this.setState(
            (prevState) => {
                if (prevState.percent < 100)
                    return {
                        percent: prevState.percent += 25,
                        page: prevState.page += 1
                    }
            }
        );

        if (this.state.percent === 100)
        {
            this.submitDetails();
        }    
    };

    onBack = () => {
        this.setState(
            (prevState) => {
                if (prevState.percent > 25)
                    return {
                        percent: prevState.percent -= 25,
                        page: prevState.page -= 1
                    }
            }
        );
    };

    onSetShopName = (shopName) => {
        this.setState(
            () => ({
                shopName: shopName
            })
        );
    }

    onSetSellerDetails = (name, image, intro,password, address, street, city, state, zipcode) => {
        this.setState(
            () => ({
                name: name,
                image: image,
                intro: intro,
                password:password,
                address: address,
                street: street,
                city: city,
                state: state,
                zipcode: zipcode
            })
        )
        this.onContinue();
    }

    onSetShopDetails = (aadhar, pan, account, gst) => {
        this.setState(
            () => ({
                aadhar: aadhar,
                pan: pan,
                account: account,
                gst: gst
            })
        );
        this.onContinue();
    }

    onSetShopPolicy = (returnPolicy, storePolicy,about) => {
        this.setState(
            () => ({
               returnPolicy: returnPolicy,
               storePolicy: storePolicy,
               about : about
            })
        );
    }

    render() {
        const pages = [
            <ShopName onNext={this.onSetShopName} {...this.state}/>,
            <SellerDetails onNext={this.onSetSellerDetails} {...this.state}/>,
            <ShopDetails onNext={this.onSetShopDetails} {...this.state}/>,
            <ShopPolicy onNext={this.onSetShopPolicy} {...this.state}/>
        ];
        
        return (
            <div>
                {console.log(this.state)}
                <div className="container_40">
                    <div id="progress">
                        <Progress showInfo={false} percent={this.state.percent}/>
                    </div>
                </div>
                <div className="bg-grey">
                    <div className="container_40">
                        {pages[this.state.page]}
                        <p style={{paddingTop: '20px', paddingBottom: '10px', textAlign: 'center'}}>For help, contact us.</p>
                        <div id="footer">
                            <button onClick={this.onBack}>Back</button>
                            <button onClick={this.onContinue}>Save and Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default AddSeller;