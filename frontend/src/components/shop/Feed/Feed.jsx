import React from "react";
import { Button, Card, Menu, Row, Col } from "antd";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { askForPermissionToReceiveNotifications } from "../../../push-notification";
import Posts from "../Shared/Posts";
import Products from "../Shared/Products";

const { Meta } = Card;

const navGroup = () => {
  return (
    <div className="container" style={{ maxWidth: 630 }}>
      <div className="navigate__items">
        <Row>
          <Link to="/feed/posts">
            <Col span={12}>Posts</Col>
          </Link>
          <Link to="/feed/products">
            <Col span={12}>Products</Col>
          </Link>
        </Row>
      </div>
    </div>
  );
};

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fixedHeader: false
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", () => {
      this.fixedHeader();
    });
  }

  fixedHeader = () => {
    let fixed = undefined;
    if (window.pageYOffset > 90) {
      fixed = true;
    } else {
      fixed = false;
    }
    if (this.state.fixedHeader !== fixed) {
      this.setState(prevState => ({
        fixedHeader: fixed
      }));
    }
  };

  render() {
    return (
      <div>
        {this.state.fixedHeader ? (
          <div className="navigate navigate--sticky">{navGroup()}</div>
        ) : (
          <div className="navigate">{navGroup()}</div>
        )}

        <Switch>
          <Route
            exact
            path="/feed/"
            component={() => <Redirect to="/feed/posts" />}
          />
          <Route path="/feed/posts/" component={Posts} />
          <Route path="/feed/products/" component={Products} />
        </Switch>
      </div>
    );
  }
}

export default Feed;
