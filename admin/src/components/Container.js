import React from 'react';
import {Layout, Menu, Icon, Popover} from 'antd';
import {Link} from 'react-router-dom';
import Router from './Router/AppRouter';
import {withApollo} from 'react-apollo';
import {GET_AUTH} from "./Query/query";
import NotificationCard from "./Dashboard/NotificationCard";

const {Header, Content, Footer, Sider} = Layout;

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            data: undefined,
            name: 'Admin',
        };
        this.logout = this.logout.bind(this);
    }

    componentWillMount() {
        this.props.client.query({
            query: GET_AUTH
        }).then(
            data => {
                data = data.data.auth;
                const name = data.user.name;
                this.setState({data: data, name: name});
                console.log(data);
            }
        );
    }

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({collapsed});
    };

    logout() {
        console.log(this.props.client);
        localStorage.clear();
        this.props.client.clearStore().then(data => {
            let auth = {
                isAuthenticated: false,
                user: {
                    id: "",
                    name: "",
                    username: "",
                    __typename: "AuthUser"
                },
                __typename: "Auth"
            };

            this.props.client.writeQuery({
                query: GET_AUTH,
                data: {auth}
            });

            console.log(data);
            console.log("Logout");
            this.props.history.push('/');
        });

    }


    render() {
        return (
            <Layout className={'admin-panel'} style={{minHeight: '100vh'}}>

                <div className='admin_header'>
                    <span style={{
                        letterSpacing: '2px',
                        fontWeight: '1000',
                        fontSize: '32px',
                        paddingLeft: '10px',
                        paddingTop: '5px',
                        lineHeight: '32px'
                    }}>
                        MK100
                    </span>

                    <div className="container_header">
                        <div className="icons">
                            <Popover
                                placement="bottomRight"
                                arrowPointAtCenter
                                content={
                                    <NotificationCard history={this.props.history} user={this.state.data}/>
                                }
                                style={{padding: 0}}
                                trigger="click"
                            >
                                <Icon type='bell' style={{cursor: 'pointer'}}/>
                            </Popover>
                        </div>
                        <div className="icons">
                            <Popover
                                placement="bottomRight"
                                arrowPointAtCenter
                                style={{padding: 0}}
                                content={(
                                    <div className='hover_logout' onClick={this.logout}>
                                        <span className="nav-text">Logout</span>
                                    </div>
                                )}
                                trigger={['click']}
                            >
                                <img src={this.state.image} className="photo__avatar"/>
                            </Popover>
                        </div>
                    </div>
                </div>

                <Layout>
                    <Sider
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.onCollapse}
                        breakpoint="lg"
                        collapsedWidth="85"
                        width={200}
                    >
                        <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>

                            <Menu.Item key="1">
                                <Link to={'/'}>
                                    <Icon type="dashboard" theme="outlined"/>
                                    <span className="nav-text">Dashboard</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to={'/orders'}>
                                    <Icon type="file-done" theme="outlined"/>
                                    <span className="nav-text">Orders</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to={'/products'}>
                                    <Icon type="dropbox" theme="outlined"/>
                                    <span className="nav-text">Products</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Link to={'/users'}>
                                    <Icon type="team" theme="outlined" style={{fontSize: '20px'}}/>
                                    <span className="nav-text">Users</span>
                                </Link>
                            </Menu.Item>
                            {/* <Menu.Item key="5">
                                <Link to={'/posts'}>
                                    <Icon type="picture" theme="outlined"/>
                                    <span className="nav-text">Posts</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="6">
                                <Link to={'/chats'}>
                                    <Icon type="message" theme="outlined"/>
                                    <span className="nav-text">Chats</span>
                                </Link>
                                </Menu.Item>*/}
                            <Menu.Item key="7">
                            <Link to={'/sellers'}>
                                <Icon type="team" theme="outlined" style={{fontSize: '20px'}}/>
                                <span className="nav-text">Sellers</span>
                            </Link>
                        </Menu.Item>
                            <Menu.Item key="5">
                                <Link to={'/approval/products'}>
                                    <Icon type="user"/>
                                    <span className="nav-text">Approval Products</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="6">
                                <Link to={'/approval/sellers'}>
                                    <Icon type="user"/>
                                    <span className="nav-text">Approval Seller</span>
                                </Link>
                            </Menu.Item>
                             
                        <Menu.Item key="8">
                            <div onClick={this.logout}>
                                <Icon type="profile"  style={{fontSize: '20px'}}/>
                                <span className="nav-text">Logout</span>
                            </div>
                        </Menu.Item> 
                        </Menu>
                    </Sider>
                    <Content style={{margin: '24px 16px', overflow: 'hidden'}}>
                        <div style={{padding: 24}}>
                            <Router/>
                        </div>
                    </Content>
                </Layout>
                {/* <Footer style={{textAlign: 'center'}}>
                    Ant Design ©2018 Created by Ant UED
                </Footer> */}
            </Layout>
        );
    }
}

export default withApollo(Container);