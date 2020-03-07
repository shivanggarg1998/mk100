import React from 'react';
import { Steps, Icon, Card, Alert, message } from "antd";
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient } from "apollo-client";
import BasicDetails from "./SignUpComplete/BasicDetails";
import AddressDetails from "./SignUpComplete/AddressDetails";
import FollowSellers from "./SignUpComplete/FollowSellers";
import SelectCategories from "./SignUpComplete/SelectCategories";
import BASE_URL from "../config"

const Step = Steps.Step;



const COMPLETE_SIGNUP = gql`
    mutation($details : UserDetailsInput, $following: [ID]!, $categories: [String] ) {
        CompleteSignup(details :$details, following: $following, categories: $categories) {
            token {
                code
                content
            }
        }
    }
`;

class SignupComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            name: '',
            image: '',
            about: '',
            mobile: '',
            // address: '',
            // street: '',
            // city: '',
            // state: '',
            // zipcode: '',
            following: [],
            categories: []
        };
    }
    getContent() {
        switch (this.state.current) {
            case 0:
                return <BasicDetails
                    onChange={this.onChange.bind(this)}
                    onFileChange={this.getfiledata.bind(this)}
                    onNext={this.onNext.bind(this)}
                    onPrev={this.onPrev.bind(this)}
                    {...this.state}
                />;
            // case 1:
            //     return <AddressDetails 
            //                 onChange={this.onChange.bind(this)} 
            //                 onNext={this.onNext.bind(this)}
            //                 onPrev={this.onPrev.bind(this)}  
            //                 {...this.state}
            //             />;
            case 1:
                return <SelectCategories
                    onChange={this.onChangeCategories.bind(this)}
                    onNext={this.onSubmit.bind(this)}
                    onPrev={this.onPrev.bind(this)}
                    {...this.state}
                />
            // case 2:
            //     return <FollowSellers
            //                 onChange={this.onChangeFollowing.bind(this)}
            //                 onNext={this.onSubmit.bind(this)}
            //                 onPrev={this.onPrev.bind(this)}  
            //                 {...this.state}
            //             />
        }
    }

    prepareInput() {
        return {
            "details": {
                "name": this.state.name,
                "image": this.state.image,
                "about": this.state.about,
                "mobile": this.state.mobile
                // "username": this.state.username
            },
            // "address": {
            //     "address": this.state.address,
            //     "street": this.state.street,
            //     "city": this.state.city,
            //     "state": this.state.state,
            //     "zipcode": this.state.zipcode
            // },
            "following": [],
            "categories": this.state.categories
        };
    }


    onSubmit() {
        let inputToGraphQL = this.prepareInput();
        let token = localStorage.getItem("token");
        let client = new ApolloClient({
            link: createUploadLink({
                uri: BASE_URL,
                headers: { authorization: token ? `Bearer ${token}` : "", }
            }),
            cache: new InMemoryCache()
        });
        client.mutate({
            mutation: COMPLETE_SIGNUP,
            variables: inputToGraphQL
        }).then(({ data }) => {
            data = data.CompleteSignup;
            console.log(data);
            if (data.token.code === 1) {
                console.log(data.token.content);
                localStorage.clear();
                localStorage.setItem("token", data.token.content);
                message.success("Profile Updated");
                // window.location.reload();
                this.props.history.push("/feed/");
            }
        });
        console.log(inputToGraphQL);
    }

    onChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    onChangeFollowing(data) {
        this.setState({
            following: data
        });
    }

    onChangeCategories(data) {
        this.setState({
            categories: data
        });
    }

    onNext() {
        let current = this.state.current;
        this.setState({
            current: current + 1
        });
    }
    getfiledata(file) {
        console.log(file);
        if (!file.type.includes("image")) {
            return;
        }
        this.setState({
            image: file
        });
    }
    onPrev() {
        let current = this.state.current;
        this.setState({
            current: current - 1
        });
    }

    render() {
        return (
            <div>
                <div className='sign_up'>
                    <div className="container">
                        <Alert
                            message="Finish Signup"
                            description="You have to finish your signup details."
                            type="info"
                            iconType="profile"
                            showIcon
                            style={{ marginTop: '50px' }}
                        />
                        <Card className='sign_up__card'>
                            <div className="container_40">
                                <div style={{ paddingBottom: '20px' }}>
                                    <Steps progressDot current={this.state.current}>
                                        <Step
                                            title="Basic Info"
                                        // description="Your basic details."
                                        />
                                        {/* <Step
                                            title="Address Info"
                                            // description="You address."
                                        /> */}
                                        <Step
                                            title="Select Interests"
                                        // description="You address."
                                        />
                                    </Steps>
                                </div>
                            </div>
                            {this.getContent()}
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignupComplete;