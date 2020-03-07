import React, {Component, Fragment} from 'react';

class ProductImages extends Component {
    state = {
        image: undefined
    };

    render() {

        let images = [];
        if (this.props.images) {
            images = this.props.images;
        }

        return (
            <Fragment>
                <div className="product__images">
                    {
                        images.map(image => {
                            console.log(123);
                            return (
                                <div onClick={() => {this.setState({image : image})}}>
                                    <img src={image}/>
                                </div>
                            )
                        })
                    }
                </div>
                <div
                    className="product__image"
                    style={{backgroundImage: `url("${this.state.image || this.props.image}")`}}
                >
                    {this.props.children}
                </div>
            </Fragment>
        );
    }
}

export default ProductImages;