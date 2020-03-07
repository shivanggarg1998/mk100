import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Icon, Mention, Modal, Input, Button, message} from "antd";
import {
    ADD_PRODUCT_REPOST,
    ADD_TO_WISHLIST,
    ADD_USER_POST_COMMENT, REMOVE_FROM_WISHLIST,
    SEARCH_USERS
} from "../../query";
import {withApollo} from 'react-apollo';
import gql from "graphql-tag";
import ShareButton from "./ShareButton";

const {TextArea} = Input;

const {toString, getMentions, toContentState, Nav} = Mention;


class UserPost extends Component {

    state = {
        addClass: "",
        collapsed: "",
        suggestions: [],
        loading: false,
        mention: toContentState(''),
        mentionDict: {},
        visible: false,
        visibleshare: false,
        loadingButton: false,
        captionValue: '',
        saved: false
    };

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
        console.log("Post for User", this.props.post);
        // console.log("in_my_wishlist", this.props.post.product.in_my_wishlist);
        setTimeout(() => {
            this.setState({collapsed: "collapsed"});
        }, 3000);
    }

    constructor(props) {
        super(props);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onAddComment = this.onAddComment.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addToWishlist = this.addToWishlist.bind(this);
        this.onMentionSelect = this.onMentionSelect.bind(this);
        this.onCaptionChange = this.onCaptionChange.bind(this);
    }

    convertToComment(string) {
        let words = string.split(/\s/);

        // Loop through the words
        let contents = words.map(function (word, i) {

            // Space if the word isn't the very last in the set, thus not requiring a space after it
            var separator = i < (words.length - 1) ? ' ' : '';

            // The word is a URL, return the URL wrapped in a custom <Link> component
            if (word.match(/@[a-zA-Z0-9]+/)) {
                return <Link key={i} to={`/user/${word.substr(1)}`}>{word}{separator}</Link>;
                // The word is not a URL, return the word as-is
            } else {
                return word + separator;
            }
        });
        return contents;
    }

    onCaptionChange(e) {
        this.setState({
            captionValue: e.target.value
        });
    }

    onSearchChange(value) {
        const searchString = value.toLowerCase();
        this.setState({loading: true});
        // console.log(searchString);
        this.props.client.query({
            query: SEARCH_USERS,
            variables: {
                input: searchString
            }
        }).then(({data}) => {
            data = data.searchUsers;
            // console.log(data);

            const suggestions = data.map(suggestion => (
                <Nav
                    value={suggestion.username}
                    data={suggestion}
                >
                    <span>{suggestion.username} ({suggestion.name})</span>
                </Nav>
            ));
            this.setState({suggestions, loading: false});
        });
    }


    onChange(editorState) {
        this.setState({
            mention: editorState
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                console.log('Errors in the form!!!');
                return;
            }
            console.log('Submit!!!');
            console.log(values);
        });
    };

    onAddComment = () => {
        const mentions = getMentions(this.state.mention);
        console.log(mentions);
        const transformedMentions = mentions.map(mention => {
            console.log(mention, typeof mention);
            return this.state.mentionDict[mention.slice(1)];
        });
        console.log(transformedMentions);

        const string = toString(this.state.mention);
        // console.log(string);
        if (string.length > 0) {
            this.props.client.mutate({
                mutation: ADD_USER_POST_COMMENT,
                variables: {
                    input: {
                        post: this.props.post.id,
                        comment: string,
                        mentions: transformedMentions,
                        parentFeedId: this.props.parentFeedId,
                    }
                },
                update: (cache, {data}) => {
                    cache.writeFragment({
                        id: `UserPost:${this.props.post.id}`,
                        fragment: gql`
                            fragment f on UserPost {
                              comments {
                                    id ,
                                    text , 
                                    username
                               }
                            }
                         `,
                        data: {
                            comments: data.addUserPostComment.comments,
                            __typename: "UserPost"
                        },
                    });
                }
            }).then(({data, error}) => {
                // console.log(data, error);
                this.resetCommentField();
            });
        }
    };

    resetCommentField() {
        this.setState({
            suggestions: [],
            mention: toContentState("")
        });
    }

    addToWishlist = () => {
        this.props.client
            .mutate({
                mutation: ADD_TO_WISHLIST,
                variables: {
                    id: this.props.post.product.id
                },
                update: (cache, {data}) => {
                    console.log(this.props.post.product.id);
                    console.log(data.addToWishlist);
                    cache.writeFragment({
                        id: `Product:${this.props.post.product.id}`,
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
                id: this.props.post.product.id
            }
        }).then(
            data => {
                if (data.data.removeFromWishlist) {
                    this.setState({saved: false});
                }
            }
        );
    };

    onMentionSelect(value, data) {
        let toBeInserted = {};
        toBeInserted[value] = data.id;
        console.log(value, data);
        this.setState({
            mentionDict: {
                ...this.state.mentionDict,
                ...toBeInserted
            }
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({loadingButton: true});
        this.props.client.mutate({
            mutation: ADD_PRODUCT_REPOST,
            variables: {
                input: {
                    product: this.props.post.product.id,
                    caption: this.state.captionValue
                }
            }
        }).then(({data}) => {
            message.success("Reposted Successfully");
            this.setState({loadingButton: false, visible: false});
        });
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {
        // console.log("Post : " , this.props.post);
        // console.log("Re-Render");
        let post = this.props.post;
        if (!post) {
            post = {};
        }
        if (!post.comments) {
            post.comments = [];
        }

        return (
            <div className="photo feed-product">
                <header className="photo__header">
                    <img src={post.user.image}
                         className="photo__avatar"/>
                    <div className="photo__user-info">
                        <span className="photo__author">{post.user.name}</span>
                        <span className="photo__location">
                            {`shared ${post.product.seller.name}'s Product`}
                        </span>
                    </div>
                </header>
                <div className={`photo__image ${this.state.addClass}`}
                     onMouseEnter={() => this.handleHover()}
                     onMouseLeave={() => this.handleDHover()}
                    //  style={{backgroundImage: `url('${product.image}')`}}
                >
                    <img src={post.product.image}/>
                    <div className="photo__image__layer"/>
                    <Link to={`/feed/product/${post.product.id}`}>
                        <div className="photo__image__view-details">View details</div>
                    </Link>
                    <div className={`photo__image__pointer ${this.state.collapsed}`}>
                        <Icon type="shopping-cart" theme="outlined"/>
                        <span>
                            Hover To View Product
                        </span>
                    </div>
                </div>
                <div className="photo__info">
                    <div className='photo__actions'>
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
                        <div className="float-right">
                            <span className="photo__action">
                                <i className="fa fa-share fa-lg"
                                   onClick={() => {
                                       this.setState({visibleshare: true});
                                   }}/>
                            </span>
                            <span className="photo__action" onClick={this.showModal}>
                                <i className="fa fa-retweet fa-lg"/>
                            </span>
                        </div>
                    </div>
                    <ul className="photo__comments">
                        <li className="photo__comment" style={{marginBottom: 5}}>
                            <span className="photo__comment-author">{post.user.username}</span> {post.caption}
                        </li>
                        {post.comments.map((comment, index) => {
                            return (
                                <li className="photo__comment" key={index}>
                                    <span className="photo__comment-author">
                                        {comment.username != null ? (
                                            <Link to={`/user/${comment.username}`}>{comment.username}</Link>) : ''}
                                    </span> &nbsp;
                                    <span>
                                        {this.convertToComment(comment.text)}
                                    </span>
                                </li>);
                        })}
                    </ul>
                    {/*<span className="photo__time-ago">2 hours ago</span>*/}
                    <div className="photo__add-comment-container">
                        <Mention
                            style={{width: '100%'}}
                            placeholder='Add a comment...'
                            onChange={this.onChange}
                            loading={this.state.loading}
                            notFoundContent={"No Users Found"}
                            onSearchChange={this.onSearchChange}
                            suggestions={this.state.suggestions}
                            onSelect={this.onMentionSelect}
                            value={this.state.mention}
                        />
                        <i className="fa fa-lg fa-send-o" onClick={this.onAddComment}/>
                        {/*<i className="fa fa-ellipsis-h"/>*/}
                    </div>
                </div>
                <Modal
                    visible={this.state.visible}
                    title="Confirm Post"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" loading={this.state.loadingButton}
                                onClick={this.handleCancel}>Return</Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            Submit
                        </Button>,
                    ]}
                >
                    <TextArea
                        onChange={this.onCaptionChange}
                        value={this.state.captionValue}/>
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


export default withApollo(UserPost);
