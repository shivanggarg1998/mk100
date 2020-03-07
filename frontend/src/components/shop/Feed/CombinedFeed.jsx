import React from "react";
// javascript plugin used to create scrollbars on windows
import Dashboards from "./Dashboard copy";
class CombinedFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      user: "",
      stateselected: "",
      role: "",
      dataselected: ""
    };
  }
  changestate(value) {
    this.setState({
      stateselected: value
    });
    console.log(value);
  }
  changestate1(value) {
    this.setState({
      dataselected: value
    });
    console.log('c', value);
  }


  render() {
    return (
      <div>
        <div className="main-panel" ref="mainPanel" style={{ width: '100%' }}>
          {/* <Header {...this.props} changestate={this.changestate.bind(this)} changestate1={this.changestate1.bind(this)} /> */}

          <Dashboards
            {...this.props}
            state={this.state.stateselected}
            dataselected={this.state.dataselected}
          />

        </div>
      </div>
    );
  }
}

export default CombinedFeed;
