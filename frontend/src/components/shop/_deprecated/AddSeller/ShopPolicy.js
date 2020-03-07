import React from "react";
import {
    Form,
    Button,
} from "antd";
import ReactQuill from "react-quill";

const FormItem = Form.Item;
const modules = {
    toolbar: [
        [{'header': '1'}, {'header': '2'}, {'font': []}],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'},
            {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
];

class ShopPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            ReturnPolicy: "",
            StorePolicy: "",
            About: ""
        };
        this.handleaboutchange = this.handleaboutchange.bind(this);
        this.handlereturnchange = this.handlereturnchange.bind(this);
        this.handlestorechange = this.handlestorechange.bind(this);
    }

    handleaboutchange = e => {
        this.setState({
            About: e
        });
    };
    handlereturnchange = e => {
        this.setState({
            ReturnPolicy: e
        });
    };

    handlestorechange = e => {
        this.setState({
            StorePolicy: e
        });
    };


    handleSubmit = e => {
        e.preventDefault();
        this.props.onNext(this.state.ReturnPolicy, this.state.StorePolicy, this.state.About);

    };

    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    render() {
        // const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18}
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
            <div className="form_content">
                <div className="container_80">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout} label="Store Policy">

                            <ReactQuill name="ReturnPolicy" style={{lineHeight: '22px'}} modules={modules}
                                        formats={formats} value={this.state.ReturnPolicy}
                                        onChange={this.handlereturnchange}/>

                        </FormItem>

                        <FormItem {...formItemLayout} label="Return Policy">

                            <ReactQuill name="StoryPolicy" style={{lineHeight: '22px'}} modules={modules}
                                        formats={formats} value={this.state.StorePolicy}
                                        onChange={this.handlestorechange}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="About">

                            <ReactQuill name="About" style={{lineHeight: '22px'}} modules={modules} formats={formats}
                                        value={this.state.About}
                                        onChange={this.handleaboutchange}/>
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const WrappedShopPolicy = Form.create()(ShopPolicy);

export default WrappedShopPolicy;
