import React, { Fragment } from "react";
import { Button, Form, Icon, Input, message, Col } from "antd";
import { Mutation, withApollo } from "react-apollo";
import { gql } from "apollo-boost";

const FORGOT_PASSWORD = gql`
  mutation($email: String!) {
    ForgotPassword(email: $email)
  }
`;

const FormItem = Form.Item;

class ForgotPassword extends React.Component {
  handleSubmit = (forgotMutation, client) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        forgotMutation({
          variables: { email: values.email }
        }).then(data => {
          data = data.data.ForgotPassword;
          // console.log(data)
          if (data["success"]) {
            message.success(data["message"]);
          } else {
            message.error(data["message"]);
          }
        });
      }
    });
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Mutation mutation={FORGOT_PASSWORD}>
        {(forgotMutation, { data, client }) => (
            <Fragment>
            <Col xs={24} sm={24} md={12}>
          <div className="border_box">
            <div className="main_box">
              <div className="main_logo">
                <div className="rect_logo">
                  <img src="/images/mk100.png" alt="" />
                </div>
              </div>
              <div className="box_content">
                <div className="box_text">
                  <div className="text-center">
                    A discovery led social shopping platform.
                  </div>
                  <Form
                    onSubmit={e => {
                      e.preventDefault();
                      this.handleSubmit(forgotMutation, client);
                    }}
                  >
                    <FormItem>
                      {getFieldDecorator("email", {
                        rules: [
                          {
                            required: true,
                            message: "Please input your Email!"
                          }
                        ]
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="user"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="Email"
                        />
                      )}
                    </FormItem>
                    <FormItem>
                      <Button htmlType="submit" className="submit_btn">
                        Submit
                      </Button>
                    </FormItem>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          </Col>
          </Fragment>
        )}
      </Mutation>
    );
  }
}

const Wrapped = Form.create()(ForgotPassword);

export default withApollo(Wrapped);
