import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Carousel} from 'antd' ;
import * as actions from '../../../actions/shop';
import ProductRouter from '../ProductRouter';

class Home extends React.Component {
    componentDidMount() {
        this.props.getProducts();
    }

    render() {
        return (
            <div>
                <Carousel className={'carousel'}>
                    <div className='slide'>
                        <img src="https://store.cezerin.com/assets/images/slide8.jpg" className='img-fluid banner'
                             alt=""/>
                    </div>
                    <div className='slide'>
                        <img src="https://store.cezerin.com/assets/images/slide7.jpg" className='img-fluid banner'
                             alt=""/>
                    </div>
                    <div className='slide'>
                        <img src="https://store.cezerin.com/assets/images/slide8.jpg" className='img-fluid banner'
                             alt=""/>
                    </div>
                    <div className='slide'>
                        <img src="https://store.cezerin.com/assets/images/slide7.jpg" className='img-fluid banner'
                             alt=""/>
                    </div>
                </Carousel>
                <div className="container_40">
                    <div className="products">
                        {this.props.products.map((image, index) =>
                            <div key={index} className={'product'}>
                                <div className='image-container'>
                                    <Link to={"/shop/" + (index + 1)}>
                                        <img className="img_fluid" // each_product
                                             alt={image.description} key={index}
                                             src={image.image_url}/>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <ProductRouter/>
            </div>
        );
    }
}

const HomeContainer = connect(
    state => state,
    actions
)(Home);

export default HomeContainer;
