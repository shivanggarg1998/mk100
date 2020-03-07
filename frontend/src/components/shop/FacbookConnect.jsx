import React from 'react';
import {gql} from 'apollo-boost';
import {Query, withApollo} from 'react-apollo';
import {Row, Col, Button, message} from 'antd';

const FB_FRIENDS = gql`
    query FB_FRIENDS ($token: String, $id: String){
        fbFriends(input: {
            accessToken: $token,
            userID: $id
        }) { 
            id
            name
            image
        }
    }
`;

const FOLLOW_FRIENDS = gql`
    mutation FOLLOW ($ids: [ID]!){
        followFBFriends(ids: $ids)
    }
`;

const idListArray = (data) => {
    let res = [];
    data.forEach(
        user => res.push(user.id)
    );
    return res;
}

class FacebookConnect extends React.Component {
    state = {
        accessToken: undefined,
        userID: undefined
    }

    componentWillMount() {
        this.setState({
            accessToken: localStorage.getItem('accessToken'),
            userID: localStorage.getItem('userID')
        });
    }

    onClick(data) {
        const ids = idListArray(data);
        this.props.client.mutate({
            mutation: FOLLOW_FRIENDS,
            variables: {ids: ids}
        }).then(
            data => {
                console.log(data);
                if (data) {
                    message.info("Followed");
                } else {
                    message.error("Error. Try again later.")
                }
            }
        );
    }

    render() {
        console.log(this.state);
        return (
            <Query 
                query={FB_FRIENDS} 
                variables={{ token: this.state.accessToken, id: this.state.userID }}
            >
            {
                ({loading, data}) => {
                    if (loading) {
                        return <p>Loading...</p>
                    }
                    data = data.fbFriends;

                    return (
                        <div className="container">
                            <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '20px', paddingBottom: '20px', fontSize: '26px', color: '#000000c2' }}>
                                <span>Friends that are connected on Facebook</span>
                                <Button onClick={e => this.onClick(data)} type="primary">Follow</Button>
                            </div>
                            <Row>
                                {
                                    data.map(
                                        (user, index) => {
                                            return (
                                                <Col span={8} key={index}>
                                                    <div 
                                                        style={{margin: '5px',backgroundColor: 'white', border: 'solid 1px rgb(250,238,235'}}
                                                    >
                                                        <div 
                                                            style={{ 
                                                                background: `url(${user.image})`, 
                                                                height: '220px',
                                                                backgroundRepeat: 'no-repeat',
                                                                backgroundSize: 'contain',
                                                                backgroundPosition: 'center',
                                                                margin: '10px'
                                                            }}
                                                        ></div>
                                                        <div style={{padding: '10px', borderTop: 'solid 1px #faeeeb'}}>
                                                            <h5>{user.name}</h5>
                                                        </div>
                                                    </div>    
                                                </Col>
                                            )
                                        }
                                    )
                                }
                            </Row>
                        </div>
                    );
                }
            }
            </Query>
        );
    }
}

export default withApollo(FacebookConnect);