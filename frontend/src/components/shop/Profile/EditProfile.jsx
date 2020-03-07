import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Icon, message, Upload } from "antd";

import { GET_USER, UPDATE_USER } from "../../query";
import BASE_URL from "../../config";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient } from "apollo-client";
let token = localStorage.getItem("token");
const client = new ApolloClient({
  link: createUploadLink({
    uri: BASE_URL,
    headers: { authorization: token ? `Bearer ${token}` : "" }
  }),
  cache: new InMemoryCache()
});
const FormItem = Form.Item;
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};
function beforeUpload(file) {
  var check = file.type.includes("image");
  if (!check) {
    message.error("You can only upload jpg/png file!");
  }
  return check;
}
class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      about: "",
      image: "",
      username: "",
      previousImage: "",
      email: ""
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }
  onFileChange({ file, fileList }) {
    console.log(fileList);
    this.setState({ image: fileList });
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
  componentWillMount() {
    const username = this.props.match.params["id"];
    console.log(username);

    client
      .query({
        query: GET_USER,
        variables: { username: username }
      })
      .then(data => {
        if (data != null) {
          data = data.data.User;
          this.props.form.setFieldsValue({
            name: data.name,
            about: data.about,
            username: data.username,
            email: data.email
          });
          this.setState({
            name: data.name,
            about: data.about,
            previousImage: data.image,
            username: data.username,
            email: data.email
          });
        } else {
          message.error("something went wrong");
        }
      });
  }

  onChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }
  getfiledata(file) {
    if (!file.type.includes("image")) {
      return;
    }
    this.setState({
      image: file
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        client
          .mutate({
            mutation: UPDATE_USER,
            variables: {
              input: {
                name: this.state.name,
                image: this.state.image,
                about: this.state.about
              }
            }
          })
          .then(data => {
            data = data.data.updateUser;
            if (!!data) {
              window.location.reload();
              this.props.history.push(`/user/${this.state.username}`);
            } else {
              message.error("There was some problem. Try again later.");
            }
          });
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
          offset: 4
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
          <Form onSubmit={e => this.handleSubmit(e)}>
            <FormItem {...formItemLayout} label="Username">
              {getFieldDecorator("username")(<Input disabled />)}
            </FormItem>

            <FormItem {...formItemLayout} label="Email">
              {getFieldDecorator("email")(<Input disabled />)}
            </FormItem>

            <FormItem {...formItemLayout} label="Name">
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "Please input your Name" }]
              })(<Input onChange={e => this.onChange(e)} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="About">
              {getFieldDecorator("about", {
                rules: [
                  { required: true, message: "Tell something about yourself" }
                ]
              })(<Input onChange={e => this.onChange(e)} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="Image Upload">
              {getFieldDecorator("image", {
                valuePropName: "fileList",
                getValueFromEvent: this.normFile
              })(
                <Upload
                  customRequest={dummyRequest}
                  beforeUpload={beforeUpload}
                  data={file => this.getfiledata(file)}
                >
                  <Button>
                    <Icon type="upload" /> Click to upload Image
                  </Button>
                </Upload>
              )}
            </FormItem>

            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button
                style={{ margin: "5px" }}
                htmlType="button"
                onClick={() =>
                  this.props.history.push(`/user/${this.state.username}`)
                }
              >
                Back
              </Button>
              <Link to={`/user/${this.state.username}/password`}>
                <Button type="default">Reset your password</Button>
              </Link>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedEditProfile = Form.create()(EditProfile);
export default WrappedEditProfile;
