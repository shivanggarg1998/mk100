import React, {Component} from 'react';
import {Query} from "react-apollo";
import {GET_FEED_ITEM, GET_USER_FEED} from "../../query";
import ProductFeed from "./ProductFeed";
import SellerPost from "./SellerPost";
import UserPost from "./UserPost";

class FeedDetail extends Component {
    render() {

        const feedId = this.props.match.params.id;
        console.log(feedId);

        return (
            <main id='feed' style={{overflow: 'hidden'}}>
                <Query query={GET_FEED_ITEM} variables={{input: feedId}}>
                    {({loading, error, data}) => {
                        if (loading)
                            return "Loading...";

                        if (error)
                            return "Error...";

                        let feedItem = data.getFeedItem;
                        if (feedItem.refString === 'Product') {
                            return <ProductFeed product={feedItem.origin} parentFeedId={feedId}/>;
                        } else if (feedItem.refString === 'Sellerpost') {
                            return <SellerPost post={feedItem.origin} parentFeedId={feedId}/>;
                        } else if (feedItem.refString === 'UserPost') {
                            return <UserPost post={feedItem.origin} parentFeedId={feedId}/>;
                        }
                    }}
                </Query>
            </main>
        );
    }
}

export default FeedDetail;