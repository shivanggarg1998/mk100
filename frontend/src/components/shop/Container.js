import React from 'react';
import Router from '../router/ShopRouter';
import Header from './Header/Header'
import MobileHeader from './MobileHeader';

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.changeMobileHeader = this.changeMobileHeader.bind(this);
        this.state = {
            isMobile: false
        }
    }

    changeMobileHeader() {
        if(window.innerWidth <= 900) {
            this.setState({isMobile: true})
        } else {
            this.setState({isMobile: false})
        }
    }

    componentWillMount() {
        this.changeMobileHeader();
    }

    componentDidMount() {
        window.addEventListener("resize", this.changeMobileHeader);
    }

    render() {
        console.log(this.state);
        return (
            <div>
                {this.state.isMobile ? <MobileHeader {...this.props}/> : <Header {...this.props}/>}
                <div>
                    <Router/>
                </div>
            </div>
        )
    }
}

export default Container;
