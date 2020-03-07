import React from 'react';
import {Row, Col} from 'antd';
import {Switch, Route, Redirect} from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';

class Landing extends React.Component {
    state = {
        selected: 0
    };

    render() {
        return (
            <div>
                <div className="main">
                    <div className="main_page"/>
                    <div className="seller_container">
                        <div className="border_box_2">
                            <div className="seller_link">
                                <a>
                                    Sellers <br/>
                                    this way!
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="main_content">
                        <Row>
                            <Col xs={24} sm={24} md={12}>
                                <div style={{margin: 'auto' , width: 'fit-content'}}>
                                    {/* <div className="white_overlay">
                                        <div className="text_box">
                                            Opening <br/> Soon!
                                        </div>
                                    </div> */}
                                    <Switch>
                                        <Route exact path="/auth/login" component={Login}/>
                                        <Route exact path="/auth/signup" component={Signup}/>
                                        <Route exact path="/auth/forgot" component={ForgotPassword}/>
                                    </Switch>
                                </div>
                            </Col>
                            <Col xs={0} sm={0} md={12}>
                                <div className="box_animated_text">
                                    <div className='white_spans'>
                                        <div>DEVBHOOMI.</div>
                                        <div>DISCOVERY.</div>
                                        <div>SHOPPING.</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

export default Landing;