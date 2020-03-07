import React from 'react';
import {Col, Icon, Row} from 'antd';

// TODO : 3 on mobile and 4 on desktop

const colResponsive = {
    lg: 6,
    md: 6,
    sm: 8,
    xs: 8
};


class TrendingFeed extends React.Component {


    render() {

        return <div className="container">
            <br/>
            <h2>Explore Products</h2>
            <br/>
            <Row gutter={{xs: 2, sm: 8, md: 12, lg: 16}} className="row_feed">
                <Col {...colResponsive}>
                    <img style={{maxHeight: '100%', maxWidth: '100%'}} src="./product_images/product1.jpg"/>
                    <div className="topRight">
                        <Icon type="camera"/>
                    </div>
                </Col>
                <Col {...colResponsive}>
                    <img style={{maxHeight: '100%', maxWidth: '100%'}} src="./product_images/product2.jpg"/>
                    <div className="topRight">
                        <Icon type="video-camera" theme='filled'/>
                    </div>
                </Col>
                <Col {...colResponsive}>
                    <img style={{maxHeight: '100%', maxWidth: '100%'}} src="./product_images/product3.jpg"/>
                    <div className="topRight">
                        <Icon type="file-text" theme='filled'/>
                    </div>
                </Col>
                <Col {...colResponsive}>
                    <img style={{maxHeight: '100%', maxWidth: '100%'}} src="./product_images/product3.jpg"/>
                    <div className="topRight">
                        <Icon type="file-text" theme='filled'/>
                    </div>
                </Col>
            </Row>

        </div>;
    }


}

export default TrendingFeed;