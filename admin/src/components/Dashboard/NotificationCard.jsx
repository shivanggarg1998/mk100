import React, {Component} from 'react';
import {Query, withApollo} from 'react-apollo';
import {Row, Col, Card} from 'antd';
import {gql} from 'apollo-boost';
import {GET_NOTIFICATION} from "../Query/query";


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


class NotificationCard extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (notification) => {
        console.log(notification);
        // this.props.client.mutate({
        //     mutation: SET_NOTIF_READ,
        //     variables: {
        //         notifID: notification.id
        //     }
        // }).then(data => {
        //     console.log(data);
        //     console.log(this.props);
        this.props.history.push(notification.action);
        // });
    };

    render() {
        return (
            <Query query={GET_NOTIFICATION}>
                {({loading, data}) => {
                    data = data.getNotifsForAdmin;
                    if (loading) {
                        return <Card loading={true}/>;
                    }
                    console.log(data);
                    // // const userID = this.props.user.auth.user.id;
                    // // console.log(this.userID);

                    if (data.length === 0) {
                        return (
                            <Card title={"Notifications "}>
                                <p>No Notifications</p>
                            </Card>
                        );
                    }

                    return (
                        <Card title={"Notifications "} className='notification__container'>
                            {data.map(
                                (notification, index) => {
                                    return (

                                        <Row
                                            key={index}
                                            className="notification"
                                            onClick={() => this.handleClick(notification)}
                                            style={{
                                                backgroundColor: '#fffff',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {/* <Col span={4}>
                                                <img
                                                    src={notification.image}
                                                    style={{
                                                        width: '100%',
                                                        padding: "0 10px 10px 10px",
                                                        borderRadius: '50%'
                                                    }}
                                                    className="notification__image"
                                                />
                                            </Col> */}
                                            <Col span={24}>
                                                <span>{notification.text}</span>
                                            </Col>
                                        </Row>

                                    );
                                }
                            )}
                        </Card>
                    );
                }}
            </Query>
        );
    }
}


export default withApollo(NotificationCard);

