import React from 'react';
import { Form, Input, Button, Icon, message } from "antd";
import { gql } from 'apollo-boost';
import { withApollo } from 'react-apollo';

const FormItem = Form.Item;

const EDIT_PASSWORD = gql`
    mutation($oldPassword: String!, $newPassword: String!) {
        ChangePassword(
            oldPassword: $oldPassword,
            newPassword: $newPassword
        )
    }
`;

class EditPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
        this.validateToNextPassword = this.validateToNextPassword.bind(this);
        this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const username = this.props.match.params.id;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                
                this.props.client.mutate({
                    mutation: EDIT_PASSWORD,
                    variables: {
                        oldPassword: values.old,
                        newPassword: values.password
                    }
                }).then(
                    data => {
                        data = data.data.ChangePassword;
                        if (data["success"]) {
                            message.success(data["message"]);
                            this.props.history.push(`/user/${username}`);
                        } else {
                            message.error(data["message"]);
                        }
                    }
                )
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter are inconsistent!');
        } else {
            callback();
        }
    }
    
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 }
            }
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 8
                }
            }
        };
    
        return (
            <div className="form_content" style={{ position: "relative" }}>
                <div className="container_160">
                    <div
                        style={{
                            margin: "40px 20px",
                            fontFamily: "Work Sans"
                        }}
                    >
                        <h1>Edit your Profile</h1>
                    </div>
                    <Form onSubmit={this.handleSubmit}>
                        
                        <FormItem
                            {...formItemLayout}
                            label="Password"
                        >
                            {getFieldDecorator('old', {
                                rules: [{
                                    required: true, message: 'Please input your old password!',
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="New Password"
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: 'Please input your new password!',
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>
                        
                        <FormItem
                            {...formItemLayout}
                            label="Confirm Password"
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: 'Please confirm your password!',
                                }, {
                                    validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>

                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

const WrappedEditPassword = Form.create()(EditPassword);
export default withApollo(WrappedEditPassword);