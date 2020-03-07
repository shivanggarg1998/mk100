import React from 'react';
import ReactGA from 'react-ga';


function initializeReactGA() {
    ReactGA.initialize('UA-127088797-1');
    ReactGA.pageview('/');
}

initializeReactGA();

export default Component =>
    class WithAnalytics extends React.Component {
        componentDidMount() {
            const page = this.props.location.pathname;
            this.trackPage(page);
        }

        componentWillReceiveProps(nextProps) {
            const currentPage = this.props.location.pathname;
            const nextPage = nextProps.location.pathname;
            if (currentPage !== nextPage) this.trackPage(nextPage);
        }

        trackPage = page => {
            ReactGA.set({page});
            ReactGA.pageview(page);
        };

        render() {
            return <Component {...this.props} />;
        }
    };
