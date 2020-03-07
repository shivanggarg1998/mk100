import React from "react";
import {Steps, Icon, Card, Button} from "antd";
import {message} from "antd/lib/index";
import {withApollo} from 'react-apollo';
import FacebookSignup from 'react-facebook-login';
import BasicDetails from "../SignUp/BasicDetails";
import AddressDetails from "../SignUp/AddressDetails";
import PasswordDetails from "../SignUp/PasswordDetails";
import {USER_SIGNUP, FB_SIGNUP} from "../../query";

const Step = Steps.Step;

// TODO : Update Cache as Done in Login
// TODO : Check for Availability of UserName

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            name: '',
            email: '',
            image: '',
            about: '',
            password: '',
            username: '',
            address: '',
            street: '',
            city: '',
            state: '',
            zipcode: '',
            confirmpassword: ''
        };
        this.responseFacebook = this.responseFacebook.bind(this);
    }

    responseFacebook(data) {
        const input = {
            "accessToken": data.accessToken,
            "userID": data.userID
        };
        console.log(input);
        this.props.client.mutate({
            mutation: FB_SIGNUP,
            variables: {input: input}
        }).then((data) => {
            data = data.data.fbSignup;
            console.log(data);
            if (data.token.code === 1) {
                console.log(data.token.content);
                localStorage.setItem("token", data.token.content);
                message.success("SignUp Successful");
                this.props.history.push("/feed/");
            }
        });
    }

    getContent() {
        switch (this.state.current) {
            case 0:
                return <BasicDetails onChange={this.onChange.bind(this)} onNext={this.onNext.bind(this)}
                                     onPrev={this.onPrev.bind(this)} {...this.state}/>;
            case 1:
                return <AddressDetails onChange={this.onChange.bind(this)} onNext={this.onNext.bind(this)}
                                       onPrev={this.onPrev.bind(this)}  {...this.state}/>;
            case 2:
                return <PasswordDetails onChange={this.onChange.bind(this)} onNext={this.onSubmit.bind(this)}
                                        onPrev={this.onPrev.bind(this)} {...this.state} />;
        }
    }

    onChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    onNext() {
        let current = this.state.current;
        this.setState({
            current: current + 1
        });
    }

    prepareInput() {
        return {
            "input": {
                "email": this.state.email,
                "password": this.state.password
            },
            "details": {
                "name": this.state.name,
                "image": this.state.image,
                "about": this.state.about,
                "username": this.state.username
            },
            "address": {
                "address": this.state.address,
                "street": this.state.street,
                "city": this.state.city,
                "state": this.state.state,
                "zipcode": this.state.zipcode
            }
        };
    }


    onSubmit() {
        let inputToGraphQL = this.prepareInput();
        this.props.client.mutate({
            mutation: USER_SIGNUP,
            variables: inputToGraphQL
        }).then(({data}) => {
            console.log(data);
            data = data.UserSignup;
            if (data.token.code === 1) {
                console.log(data.token.content);
                localStorage.setItem("token", data.token.content);
                message.success("SignUp Successful");
                this.props.history.push("/feed/");
            }
        });


        message.success('Registration Done');

    }

    onPrev() {
        let current = this.state.current;
        this.setState({
            current: current - 1
        });
    }

    render() {
        return (
            <div className='sign_up'>
                <div className="container">
                    <Card className='sign_up__card'>
                        {console.log(this.state)}
                        <div className="container_40">
                            <div>
                                <Steps progressDot current={this.state.current}>
                                    <Step
                                        title="Basic Info"
                                        description="This is a description."
                                    />
                                    <Step
                                        title="Address Info"
                                        description="This is a description."
                                    />
                                    <Step
                                        title="Password info"
                                        description="This is a description."
                                    />
                                </Steps>
                            </div>
                            {this.getContent()}
                            OR
                            <div>
                                <FacebookSignup 
                                    appId="285659762264023"
                                    callback={this.responseFacebook}
                                    icon="fa-facebook"
                                    scope="public_profile,user_friends,email"
                                />
                            </div>
                        </div>

                    </Card>
                </div>
            </div>
        );
    }
}

export default withApollo(SignUp);
