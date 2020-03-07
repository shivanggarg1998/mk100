import React from 'react';
import {gql} from 'apollo-boost';
import {Query} from 'react-apollo';
import {List, Avatar} from 'antd';

const GET_FOLLOWERS = gql`
    query($username: String!) {
        getFollower(username: $username) {
            id
            name
            image
            username
        }
    }
`;

const GET_FOLLOWING = gql`
    query($username: String!) {
        getFollowing(username: $username) {
            id
            name
            image
            username
        }
    }
`;


class UserFollowerFollowing extends React.Component {
    render() {
        return (
            <Query 
                query={this.props.id === 1 ? GET_FOLLOWERS : GET_FOLLOWING}
                variables={{username: this.props.username}}
            >
            {
                ({loading, data, error}) => {

                    if (loading) return <p>Loading...</p>
                    if (error) return <p>Error</p>

                    const key = Object.keys(data)[0];
                    data = data[key];

                    return (
                        <div>
                            <List 
                                dataSource={data} 
                                renderItem={item => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta 
                                            avatar={<Avatar src={item.image} />}
                                            title={item.name}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    )
                }
            }
            </Query>
        )
    }
}

export default UserFollowerFollowing;