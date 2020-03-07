import React from 'react';
import {Form, Icon, Input, Button, message, Row, Col} from "antd";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import jwt from "jsonwebtoken";
import {GET_AUTH} from "./Query/query";
import Typing from 'react-typing-animation';
import {Link} from 'react-router-dom';

const FormItem = Form.Item;

const LOGIN_MUTATION = gql`
    mutation Login($input: AdminAuthInput) {
        AdminLogin(input: $input) {
            token {
                code
                content
            }
        }
    }
`;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (loginMutation, client) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
                loginMutation({variables: {input: values}}).then(({data}) => {
                    if (data.AdminLogin.token.code === 1) {
                        console.log(data.AdminLogin.token.content);
                        localStorage.setItem("token", data.AdminLogin.token.content);
                        message.success("Login Successful");
                        this.props.history.push("/");
                    } else {
                        message.error(data.AdminLogin.token.content);
                    }
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="main">
                <div className="main_page"></div>
                <Mutation
                    mutation={LOGIN_MUTATION}
                    update={(cache, {data: {AdminLogin}}) => {
                        let auth = {
                            isAuthenticated: AdminLogin.token.code === 1,
                            user: {
                                id: "",
                                name: "",
                                username: "",
                                ...jwt.decode(AdminLogin.token.content),
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
                        <div>
                            <div className="main_content">
                                <Row>
                                    <Col xs={24} sm={24} md={12}>
                                        <div className="border_box">
                                            <div className='main_box'>
                                                <div className='rect_logo'>
                                                    <img src="/images/mk100.png" alt=""/>
                                                </div>
                                                <div className='text-center'>A discovery led shopping platform.</div>
                                                <div className="box_content">
                                                    <div className="box_text">
                                                        <Form
                                                            onSubmit={e => {
                                                                e.preventDefault();
                                                                this.handleSubmit(loginMutation, client);
                                                            }}
                                                        >
                                                            <FormItem>
                                                                {getFieldDecorator("username", {
                                                                    rules: [
                                                                        {
                                                                            required: true,
                                                                            message: "Please input your username!"
                                                                        }
                                                                    ]
                                                                })(
                                                                    <Input
                                                                        placeholder="Admin Username"
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
                                                                        type="password"
                                                                        placeholder="Password"
                                                                    />
                                                                )}
                                                            </FormItem>
                                                            <Button htmlType="submit"
                                                                    className="submit_btn">
                                                                Log in
                                                            </Button>
                                                        </Form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={0} sm={0} md={12}>
                                        <div className="box_animated_text">
                                            <div className='white_spans'>
                                                <div>COMMUNITY.</div>
                                                <div>DISCOVERY.</div>
                                                <div>SHOPPING.</div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    )}
                </Mutation>
            </div>
        );
    }
}

const WrappedLogin = Form.create()(Login);

export default WrappedLogin;
