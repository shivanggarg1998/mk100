import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {Mention, Modal} from 'antd';
import {
    ADD_SELLER_COMMENT,
    ADD_SELLER_POST_LIKE,
    REMOVE_SELLER_POST_LIKE,
    SEARCH_USERS
} from '../../query';
import {withApollo} from 'react-apollo';
import {gql} from 'apollo-boost';
import ShareButton from "./ShareButton";

const {toString, getMentions, toContentState, Nav} = Mention;


class SellerPost extends Component {

    state = {
        suggestions: [],
        loading: false,
        mention: toContentState(''),
        mentionDict: {},
        visibleshare: false,

    };

    constructor(props) {
        super(props);

        this.onSearchChange = this.onSearchChange.bind(this);
        this.onAddComment = this.onAddComment.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onMentionSelect = this.onMentionSelect.bind(this);
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

    onSearchChange(value) {
        const searchString = value.toLowerCase();
        this.setState({loading: true});
        console.log(searchString);
        this.props.client.query({
            query: SEARCH_USERS,
            variables: {
                input: searchString
            }
        }).then(({data}) => {
            data = data.searchUsers;
            console.log(data);

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
    removeLikeFromPost = () => {
        this.props.client.mutate({
            mutation: REMOVE_SELLER_POST_LIKE,
            variables: {
                input: {
                    post: this.props.post.id
                }
            },
            update: (cache, {data, errors}) => {
                cache.writeFragment({
                    id: `Sellerpost:${this.props.post.id}`,
                    fragment: gql`
                            fragment f on Sellerpost {
                              likes ,
                              liked_by_me
                            }
                         `,
                    data: {
                        likes: data.removeSellerPostLike.likes,
                        liked_by_me: data.removeSellerPostLike.liked_by_me,
                        __typename: "Sellerpost"
                    },
                });
            }
        }).then(({data, error}) => {
            // console.log(data, error);
        });
    };
    addLikeToPost = () => {
        this.props.client.mutate({
            mutation: ADD_SELLER_POST_LIKE,
            variables: {
                input: {
                    post: this.props.post.id
                }
            },
            update: (cache, {data}) => {
                cache.writeFragment({
                    id: `Sellerpost:${this.props.post.id}`,
                    fragment: gql`
                            fragment f on Sellerpost {
                              likes ,
                              liked_by_me
                            }
                         `,
                    data: {
                        likes: data.addSellerPostLike.likes,
                        liked_by_me: data.addSellerPostLike.liked_by_me,
                        __typename: "Sellerpost"
                    },
                });
            }
        }).then(({data, error}) => {
            // console.log(data, error);
        });
    };

    onAddComment = () => {
        const mentions = getMentions(this.state.mention);
        // console.log(mentions);
        const transformedMentions = mentions.map(mention => {
            console.log(mention, typeof mention);
            return this.state.mentionDict[mention.slice(1)];
        });
        console.log(transformedMentions);

        const string = toString(this.state.mention);
        // console.log(string);
        if (string.length > 0) {
            this.props.client.mutate({
                mutation: ADD_SELLER_COMMENT,
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
                        id: `Sellerpost:${this.props.post.id}`,
                        fragment: gql`
                            fragment f on Sellerpost {
                              comments {
                                    id ,
                                    text , 
                                    username
                               }
                            }
                         `,
                        data: {
                            comments: data.addSellerComment.comments,
                            __typename: "Sellerpost"
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

    render() {

        let post = this.props.post;
        // console.log(post);
        if (!post) {
            post = {};
        }
        if (!post.comments) {
            post.comments = [];
        }
        return (
            <div className="photo" key={post.id}>
                <header className="photo__header">
                    <img
                        src={post.seller.image}
                        className="photo__avatar"/>
                    <div className="photo__user-info">
                        <span className="photo__author">{post.seller.name}</span>
                        <span className="photo__location"/>
                    </div>
                </header>
                {/* style={{backgroundImage: `url("${post.image}")`}} */}
                <div className="photo__image">
                    <img src={post.image}/>
                </div>
                <div className="photo__info" style={{textAlign: 'left'}}>
                    <div className='photo__actions'>
                        {
                            post.liked_by_me && (
                                <span className='photo__save' onClick={this.removeLikeFromPost}>
                                    Liked
                                </span>
                            )
                        }
                        {
                            !post.liked_by_me && (
                                <span className='photo__save' onClick={this.addLikeToPost}>
                                    Like
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
                        </div>
                    </div>
                    <span className="photo__likes">{post.likes} likes</span>
                    <ul className="photo__comments">
                        <li className="photo__comment" style={{marginBottom: 5}}>
                            <span className="photo__comment-author">{post.seller.shopName}</span> {post.caption}
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
                    <span className="photo__time-ago">{post.updated_at}</span>

                    <div className="photo__add-comment-container">
                        <Mention
                            style={{width: '100%'}}
                            placeholder='Add a comment...'
                            onChange={this.onChange}
                            loading={this.state.loading}
                            notFoundContent={"No Users Found"}
                            onSearchChange={this.onSearchChange}
                            suggestions={this.state.suggestions}
                            value={this.state.mention}
                            onSelect={this.onMentionSelect}
                        />
                        <i className="fa fa-lg fa-send-o" onClick={this.onAddComment}/>
                        {/*<i className="fa fa-ellipsis-h"/>*/}
                    </div>
                </div>
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


export default withApollo(SellerPost);
