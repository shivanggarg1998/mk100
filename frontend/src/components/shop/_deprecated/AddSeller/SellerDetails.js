import React from 'react';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class SellerDetails extends React.Component {
    state = {
        confirmDirty: false,
    };

    componentDidMount() {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            'Name': this.props.name,
            'Image': this.props.image,
            'intro': this.props.intro,
            'Address': this.props.address,
            'Street': this.props.street,
            'City': this.props.city,
            'State': this.props.state,
            'Zipcode': this.props.zipcode,
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
                    data[4].value,
                    data[5].value,
                    data[6].value,
                    data[7].value
                );
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
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
                            label="Name"
                        >
                            {
                                getFieldDecorator('Name',
                                {
                                    rules: [
                                        { required: true, message: 'Please input your Name'}
                                    ]
                                }) (
                                    <Input />
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="Image"
                        >
                            {
                                getFieldDecorator('Image',
                                {
                                    rules: [
                                        { required: true, message: 'Upload an Image'}
                                    ]
                                }) (
                                    <Input />
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="Intro"
                        >
                            {
                                getFieldDecorator('intro',
                                {
                                    rules: [
                                        { required: true, message: 'Tell something about yourself'}
                                    ]
                                }) (
                                    <Input />
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="Address"
                        >
                            {
                                getFieldDecorator('Address',
                                {
                                    rules: [
                                        { required: true, message: 'Please input your Address'}
                                    ]
                                }) (
                                    <Input />
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="Street"
                        >
                            {
                                getFieldDecorator('Street',
                                {
                                    rules: [
                                        { required: true, message: 'Please input the Street'}
                                    ]
                                }) (
                                    <Input />
                                )
                            }
                        </FormItem>
                
                        <FormItem
                            {...formItemLayout}
                            label="City"
                        >
                            {
                                getFieldDecorator('City',
                                {
                                    rules: [
                                        { required: true, message: 'Please input the City'}
                                    ]
                                }) (
                                    <Input />
                                )
                            }
                        </FormItem>
    
                        <FormItem
                            {...formItemLayout}
                            label="State"
                        >
                            {
                                getFieldDecorator('State',
                                {
                                    rules: [
                                        { required: true, message: 'Please input the State'}
                                    ]
                                }) (
                                    <Input />
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="Zipcode"
                        >
                            {
                                getFieldDecorator('Zipcode',
                                {
                                    rules: [
                                        { required: true, message: 'Please input your Zipcode'}
                                    ]
                                }) (
                                    <Input type="number"/>
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

const WrappedSellerDetails = Form.create()(SellerDetails);

export default WrappedSellerDetails;