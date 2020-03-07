import React, {Component} from 'react';
import {Query} from 'react-apollo';
import SellerPost from '../Feed/SellerPost';
import {GET_SELLER_POSTS_BY_FEED} from '../../query';

class SellerPostContainer extends Component {
    render() {
        return (
            <main id="feed">
                <Query query={GET_SELLER_POSTS_BY_FEED} variables={{id: this.props.seller}}>
                    {({loading, error, data}) => {
                        if (loading) {
                            return <p>Loading...</p>;
                        }
                        if (error) {
                            return <p>Error...</p>;
                        }
                        console.log(data);
                        data = data.getSellerPostByFeed;
                        return (
                            data.map((feed, index) => {
                                console.log(feed);
                                return (
                                    <SellerPost key={index} post={feed.origin}/>
                                );
                            }));
                    }}
                </Query>
            </main>
        );
    }
}


export default SellerPostContainer;