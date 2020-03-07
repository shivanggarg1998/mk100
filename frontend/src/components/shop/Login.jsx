import React, {Fragment} from "react";
import {Button, Col, Form, Icon, Input, message} from "antd";
import {Link} from 'react-router-dom';
import {Mutation, withApollo} from "react-apollo";
import jwt from "jsonwebtoken";
import FacebookLogin from 'react-facebook-login';
import {FB_SIGNIN, GET_AUTH, LOGIN_MUTATION} from "../query";

const FormItem = Form.Item;

class Login extends React.Component {
    responseFacebook = (data) => {
        const input = {
            "accessToken": data.accessToken,
            "userID": data.userID
        };
        localStorage.clear();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('userID', data.userID);
        this.props.client.mutate({
            mutation: FB_SIGNIN,
            variables: {input: input},
            update: (cache, {data: {fbSignin}}) => {
                console.log(fbSignin);
                let auth = {
                    isAuthenticated: fbSignin.token.code === 1,
                    user: {
                        id: "",
                        name: "",
                        username: "",
                        ...jwt.decode(fbSignin.token.content),
                        __typename: "AuthUser"
                    },
                    __typename: "Auth"
                };

                cache.writeQuery({
                    query: GET_AUTH,
                    data: {auth}
                });
            }
        }).then((data) => {
            // console.log(data);
            data = data.data.fbSignin;
            // console.log(data);
            if (data.token.code === 1) {
                console.log(data.token.content);
                localStorage.setItem("token", data.token.content);
                message.success("Login Successful");
                setTimeout(() => {
                    this.props.history.push("/feed/");
                }, 500);
            } else {
                message.error(data.token.content);
            }
        });
    };
    handleSubmit = (loginMutation, client) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
                loginMutation({variables: {input: values}}).then(({data}) => {
                    if (data.UserLogin.token.code === 1) {
                        console.log(data.UserLogin.token.content);
                        localStorage.clear();
                        localStorage.setItem("token", data.UserLogin.token.content);
                        message.success("Login Successful");
                        setTimeout(() => {
                            this.props.history.push("/feed/");
                        }, 500);
                    } else {
                        message.error(data.UserLogin.token.content);
                    }
                });
            }
        });
    };

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.responseFacebook = this.responseFacebook.bind(this);
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Mutation
                mutation={LOGIN_MUTATION}
                update={(cache, {data: {UserLogin}}) => {
                    console.log(UserLogin);
                    let auth = {
                        isAuthenticated: UserLogin.token.code === 1,
                        user: {
                            id: "",
                            name: "",
                            username: "",
                            ...jwt.decode(UserLogin.token.content),
                            __typename: "AuthUser"
                        },
                        __typename: "Auth"
                    };

                    cache.writeQuery({
                        query: GET_AUTH,
                        data: {auth}
                    });
                }}
            >
                {(loginMutation, {data, client}) => (
                    <Fragment>
                        <div className="border_box">
                            <div className='main_box'>
                                <div className='rect_logo'>
                                    <img src="/images/mk100.png" alt=""/>
                                </div>
                                <div className='text-center' style={{fontSize: '1rem'}}>
                                    A discovery led shopping platform.
                                </div>
                                <div className="box_content">
                                    <div className="box_text">
                                        <Form
                                            onSubmit={e => {
                                                e.preventDefault();
                                                this.handleSubmit(loginMutation, client);
                                            }}
                                        >
                                            <FormItem>
                                                {getFieldDecorator("email", {
                                                    rules: [
                                                        {required: true, message: "Please input your Email!"}
                                                    ]
                                                })(
                                                    <Input
                                                        prefix={
                                                            <Icon
                                                                type="user"
                                                                style={{color: "rgba(0,0,0,.25)"}}
                                                            />
                                                        }
                                                        placeholder="Email"
                                                    />
                                                )}
                                            </FormItem>
                                            <FormItem>
                                                {getFieldDecorator("password", {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "Please input your Password!"
                                                        }
                                                    ]
                                                })(
                                                    <Input
                                                        prefix={
                                                            <Icon
                                                                type="lock"
                                                                style={{color: "rgba(0,0,0,.25)"}}
                                                            />
                                                        }
                                                        type="password"
                                                        placeholder="Password"
                                                    />
                                                )}
                                            </FormItem>
                                            <Link to="/shop/forgot">
                                                <p style={{
                                                    padding: 0,
                                                    fontSize: '14px',
                                                    marginTop: '-10px',
                                                    cursor: 'pointer'
                                                }}>
                                                    Forgot Password?
                                                </p>
                                            </Link>
                                            <Button htmlType="submit" className="submit_btn">
                                                Log in
                                            </Button>
                                        </Form>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="border_box_1 mt-4">
                            <div className="main_box text-center">
                                <div className='heading'>Not on <strong>K-SEVA</strong> yet?</div>
                                <div className='heading'>
                                    <strong>
                                        <Link to={'/auth/signup'}>REGISTER</Link>
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </Fragment>


                )}
            </Mutation>
        );
    }
}

const WrappedLogin = Form.create()(Login);

export default withApollo(WrappedLogin);
