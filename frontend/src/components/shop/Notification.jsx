import React from 'react';
import {Query, withApollo} from 'react-apollo';
import {Row, Col} from 'antd';
import {gql} from 'apollo-boost';
import {GET_USER_NOTIFS} from '../query';

const SET_NOTIF_READ = gql`
    mutation($notifID: ID!) {
        notificationRead(id: $notifID) {
            id
            text
        }
    }
`;

const findIDinObj = (userData, id) => {
    for (let i = 0; i < userData.length; i++) {
        if (userData[i].id == id)
            return true;
    }
};

class Notification extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (notif) => {
        console.log(notif);
        this.props.client.mutate({
            mutation: SET_NOTIF_READ,
            variables: {
                notifID: notif.id
            }
        }).then(data => {
            console.log(data);
            console.log(this.props);
            this.props.history.push(notif.action);
        });
    };

    render() {
        return (
            <Query query={GET_USER_NOTIFS}>
                {({loading, data}) => {
                    if (loading) {
                        return <p>Loading...</p>;
                    }
                    data = data.getNotifsByUser;
                    const userID = this.props.user.auth.user.id;
                    console.log(data);

                    if (data.length === 0) {
                        return <p>No Notification</p>;
                    }

                    return (
                        data.map(
                            (notif, index) => {
                                return (
                                    <Row
                                        key={index}
                                        className="notification"
                                        onClick={() => this.handleClick(notif)}
                                        style={{
                                            backgroundColor: findIDinObj(notif.readBy, userID) ? '#00000005' : '#fffff',
                                            maxWidth : 400,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Col span={4}>
                                            <img
                                                src={notif.image}
                                                style={{
                                                    width: '100%',
                                                    padding: "0 10px 10px 10px",
                                                    borderRadius: '50%'
                                                }}
                                                className="notification__image"
                                            />
                                        </Col>
                                        <Col span={20}>
                                            <span>{notif.text}</span>
                                        </Col>
                                    </Row>
                                );
                            }
                        )
                    );
                }}
            </Query>
        );
    }
}

export default withApollo(Notification);