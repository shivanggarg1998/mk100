import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Button, Icon, message, Modal, Input} from "antd";
import {ADD_PRODUCT_REPOST, ADD_TO_WISHLIST, GET_USER_FEED, REMOVE_FROM_WISHLIST} from "../../query";
import {withApollo} from "react-apollo";
import gql from "graphql-tag";
import ShareButton from "./ShareButton";
// import {ModalLink} from 'react-router-modal'
// import Details from "../Product/Details";

const TextArea = Input.TextArea;

class ProductFeed extends Component {
    state = {
        addClass: "",
        collapsed: "",
        visible: false,
        visibleshare: false,
        loadingButton: false,
        captionValue: "",
        saved: false
    };

    constructor(props) {
        super(props);
        this.addToWishlist = this.addToWishlist.bind(this);
        this.removeFromWishlist = this.removeFromWishlist.bind(this);
        this.onCaptionChange = this.onCaptionChange.bind(this);
    }

    componentWillMount() {
        const query = gql`
			query {
				checkInWishlist(product: "${this.props.product.id}")
			}
		`;

        this.props.client.query({
            query: query
        })
            .then(data => {
                console.log(data);
                data = data.data.checkInWishlist;
                this.setState({
                    saved: data
                });
            });
    }

    onCaptionChange(e) {
        console.log(e.target.value);
        this.setState({
            captionValue: e.target.value
        });
    }

    handleHover() {
        this.setState({
            addClass: "animate",
            collapsed: ""
        });
    }

    handleDHover() {
        this.setState({
            addClass: "",
            collapsed: "collapsed"
        });
    }

    componentDidMount() {
        console.log("Product for Feed", this.props.product);

        setTimeout(() => {
            this.setState({collapsed: "collapsed"});
        }, 3000);
    }

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleOk = () => {
        this.setState({loadingButton: true});
        this.props.client
            .mutate({
                mutation: ADD_PRODUCT_REPOST,
                variables: {
                    input: {
                        product: this.props.product.id,
                        caption: this.state.captionValue
                    }
                }
            })
            .then(({data}) => {
                message.success("Reposted Successfully");
                this.setState({loadingButton: false, visible: false});
            });
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    addToWishlist = () => {
        this.props.client
            .mutate({
                mutation: ADD_TO_WISHLIST,
                variables: {
                    id: this.props.product.id
                },
                update: (cache, {data}) => {
                    console.log(this.props.product.id);
                    console.log(data.addToWishlist);
                    cache.writeFragment({
                        id: `Product:${this.props.product.id}`,
                        fragment: gql`
					fragment f on Product {
						in_my_wishlist
					}
					`,
                        data: {
                            in_my_wishlist: true,
                            __typename: "Product"
                        }
                    });
                }
            })
            .then(({data, error}) => {
                if (data.addToWishlist) {
                    this.setState({saved: true});
                }
            });
    };

    removeFromWishlist = () => {
        console.log("REMOVING");
        this.props.client.mutate({
            mutation: REMOVE_FROM_WISHLIST,
            variables: {
                id: this.props.product.id
            }
        }).then(
            data => {
                if (data.data.removeFromWishlist) {
                    this.setState({saved: false});
                }
            }
        );
    };

    render() {
        const product = this.props.product;
        // console.log(product);
        return (
            <div className="photo feed-product">
                <header className="photo__header">
                    <img src={product.seller.image} className="photo__avatar"/>
                    <div className="photo__user-info">
                        <span className="photo__author">{product.seller.name}</span>
                    </div>
                </header>

                <div
                    className={`photo__image ${this.state.addClass}`}
                    onMouseEnter={() => this.handleHover()}
                    onMouseLeave={() => this.handleDHover()}
                    //  style={{backgroundImage: `url('${product.image}')`}}
                >

                    <img src={product.image}/>

                    <div className="photo__image__layer"/>
                    <Link
                        to={{
                            pathname: `/feed/product/${product.id}`,
                            state: {parentFeedId: this.props.parentFeedId}
                        }}
                    >
                        <div className="photo__image__view-details">View details</div>
                    </Link>

                    <div className={`photo__image__pointer ${this.state.collapsed}`}>
                        <Icon type="shopping-cart" theme="outlined"/>
                        <span>Hover To View Product</span>
                    </div>
                </div>

                <div className="photo__info">
                    <div className="photo__actions">
                        {
                            this.state.saved ? (
                                <span className="photo__save" onClick={this.removeFromWishlist}>
                                    Unsave
                                </span>
                            ) : (
                                <span className="photo__save" onClick={this.addToWishlist}>
                                    Save
                                </span>
                            )
                        }

                        {/* {product.in_my_wishlist && (
							<span className="photo__save">Saved</span>
						)}
						{!product.in_my_wishlist && (
							
						)} */}

                        <div className="float-right">
                            <span className="photo__action">
                                <i
                                    className="fa fa-share fa-lg"
                                    onClick={() => {
                                        this.setState({visibleshare: true});
                                    }}
                                />
                            </span>
                            <span className="photo__action" onClick={this.showModal}>
                                <i className="fa fa-retweet fa-lg"/>
                            </span>
                        </div>
                    </div>
                </div>
                <Modal
                    visible={this.state.visible}
                    title="Confirm Post"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button
                            key="back"
                            loading={this.state.loadingButton}
                            onClick={this.handleCancel}
                        >
                            Return
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            Submit
                        </Button>
                    ]}
                >
					<TextArea
                        onChange={this.onCaptionChange}
                        value={this.state.captionValue}
                    />
                </Modal>
                <Modal
                    title="Share on Various platform"
                    visible={this.state.visibleshare}
                    onCancel={() => {
                        this.setState({visibleshare: false});
                    }}
                >
                    <ShareButton parentFeedId={this.props.parentFeedId}/>
                </Modal>
            </div>
        );
    }
}

export default withApollo(ProductFeed);
