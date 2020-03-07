import React from 'react';
import { Form, Input,  Button } from 'antd';

const FormItem = Form.Item;

class ShopDetails extends React.Component {
    state = {
        confirmDirty: false,
    };

    componentDidMount() {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            'Aadhar': this.props.aadhar,
            'PAN': this.props.pan,
            'GST': this.props.gst,
            'Bank Account': this.props.account
        });      
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            let data = e.target;
                this.props.onNext(
                    data[0].value,
                    data[1].value,
                    data[2].value,
                    data[3].value,
                );
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    render() {
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <div className="form_content">
                <div className="container_80">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="Aadhar Number"
                        >
                            {
                                getFieldDecorator('Aadhar',
                                {
                                    rules: [
                                        { required: true, message: 'Please input your Aadhar Number'}
                                    ]
                                }) (
                                    <Input />
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="PAN Number"
                        >
                            {
                                getFieldDecorator('PAN',
                                {
                                    rules: [
                                        { required: true, message: 'Please input your PAN Number'}
                                    ]
                                }) (
                                    <Input />
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="GST Number"
                        >
                            {
                                getFieldDecorator('GST',
                                {
                                    rules: [
                                        { required: true, message: 'Please input your GST Number'}
                                    ]
                                }) (
                                    <Input />
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="Bank Accont"
                        >
                            {
                                getFieldDecorator('Bank Account',
                                {
                                    rules: [
                                        { required: true, message: 'Please input your Bank Account Number'}
                                    ]
                                }) (
                                    <Input />
                                )
                            }
                        </FormItem>

                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">Register</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const WrappedShopDetails = Form.create()(ShopDetails);

export default WrappedShopDetails;