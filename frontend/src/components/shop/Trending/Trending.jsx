import React from 'react';
import {Button, Card, Menu, Row, Col} from 'antd';
import {Switch, Route, Link, Redirect} from 'react-router-dom';

import Posts from '../Shared/Posts';
import Products from '../Shared/Products';

const {Meta} = Card;

const navGroup = () => {
    return (
        <div className="container" style={{maxWidth: 630}}>
            <div className="navigate__items">
                <Row>
                    <Link to="/trending/posts"><Col span={12}>Posts</Col></Link>
                    <Link to="/trending/products"><Col span={12}>Products</Col></Link>
                </Row>
            </div>
        </div>
    );
};

class Container extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fixedHeader: false
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', () => {
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
            this.setState(
                (prevState) => ({
                    fixedHeader: fixed
                })
            );
        }

    };

    render() {
        return (
            <div className='bg-grey'>
                {
                    this.state.fixedHeader ? (
                        <div className="navigate navigate--sticky">
                            {navGroup()}
                        </div>
                    ) : (
                        <div className="navigate">
                            {navGroup()}
                        </div>
                    )
                }
                <Switch>
                    <Route exact path="/trending" component={() => <Redirect to="/trending/posts"/>}/>
                    <Route path="/trending/posts" component={Posts}/>
                    <Route path="/trending/products" component={Products}/>
                </Switch>
            </div>
        );
    }
}

export default Container;