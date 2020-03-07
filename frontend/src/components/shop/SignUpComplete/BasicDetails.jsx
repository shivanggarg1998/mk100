import React from "react";
import { Form, Input, Button, Icon, Upload,message } from "antd";

const FormItem = Form.Item;
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

class BasicDetails extends React.Component {
  componentDidMount() {
    this.props.form.setFieldsValue({
      name: this.props.name,
     // image: this.props.image,
      about: this.props.about,
      mobile: this.props.mobile
      // 'username': this.props.username,
    });
  }
  normFile = e => {
    console.log("Upload event:", e);
    if (e.file.type.includes("image") == false) {
      return null;
    }
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  
  handlenext(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onNext();
      }
    });
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
        <div className="container_80">
          <Form>
            <Icon
              onClick={e => {
                this.handlenext(e);
              }}
              type="right"
              theme="outlined"
              style={{
                left: "90%",
                position: "absolute",
                top: "45%",
                fontSize: "35px",
                fontWeight: "25px"
              }}
            />

            <FormItem {...formItemLayout} label="Name">
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "Please input your Name" }]
              })(
                <Input
                  onChange={e => this.props.onChange(e)}
                  onChange={e => this.props.onChange(e)}
                />
              )}
            </FormItem>
            
            <FormItem {...formItemLayout} label="Address">
              {getFieldDecorator("about", {
                rules: [
                  { required: true, message: "Tell something about yourself" }
                ]
              })(<Input onChange={e => this.props.onChange(e)} />)}
            </FormItem>

            <FormItem
                {...formItemLayout}
                label="Mobile"
            >
                {
                    getFieldDecorator('mobile',
                        {
                            rules: [
                                { required: true, message: 'Please input the Mobile'},
                                { max: 10, message: 'Enter 10 Digit Mobile Number' }
                            ]
                        }) (
                        <Input type='number' onChange={e => this.props.onChange(e)} />
                    )
                }
            </FormItem>

            {/* <FormItem {...formItemLayout} label="Image Upload">
            {getFieldDecorator("image", {
                valuePropName: "fileList",
                getValueFromEvent: this.normFile,
                rules: [
                  { required: true, message: 'Please input the image'}
                ]
              })(
                <Upload
                customRequest={dummyRequest}
                beforeUpload={beforeUpload}
                data={file => this.props.onFileChange(file)}
                >
                  <Button>
                    <Icon type="upload" /> Click to upload Image
                  </Button>
                </Upload>
              )}
            </FormItem> */}

          </Form>
        </div>
      </div>
    );
  }
}

const WrappedBasicDetails = Form.create()(BasicDetails);

export default WrappedBasicDetails;
