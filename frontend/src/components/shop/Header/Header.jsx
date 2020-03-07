import React, { Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import { Col, Dropdown, Icon, AutoComplete, Input, Menu, Popover, Row } from "antd";
import { Query, withApollo } from "react-apollo";
import { GET_AUTH, GET_SEARCH_USER_SELLER } from "../../query";
import Notifs from '../Notification';
import { categories } from './categories';

// TODO: Add User Notifications

const Search = Input.Search;
const Option = AutoComplete.Option;
const text = <span style={{ fontSize: '18px', fontWeight: '600' }}> Notifications</span>;

const MenuI = (props) => {
    console.log(props);
    return (
        <Menu>
            {/*<Menu.Item key="1"><NavLink to={`/user/${props.user.username}`}>Your Profile</NavLink></Menu.Item>*/}
            <Menu.Item key="2"><NavLink to="/orders">Your Orders</NavLink></Menu.Item>
            <Menu.Item key="3"><NavLink to="/chat">Your Messages</NavLink></Menu.Item>
            <Menu.Item key="4" onClick={props.logout}>Log Out</Menu.Item>
        </Menu>
    );
};

const menu = (
    <div className="categories">
        <Row>
            {
                categories.map((category, index) => (
                    <Col span={8} key={index}>
                        <ul className="categories__list">
                            <strong>
                                <li>{category.name}</li>
                            </strong>
                            {
                                category.items.map((item, index) => (
                                    <Link to={`/category/${category.name.toLowerCase()}/${item.toLowerCase()}`}>
                                        <li key={index}>{item}</li>
                                    </Link>
                                ))
                            }
                        </ul>
                    </Col>

                ))
            }
        </Row>
    </div>
);

const left_section = (
    <Fragment>
        <li>
            <Dropdown overlay={menu} trigger={["click"]}>
                <span className="box-shadow-menu">
                    {/*Menu*/}
                </span>
            </Dropdown>
        </li>
        <li>
            <Link to="/feed">My Feed</Link>
        </li>
        <li>
            {/*<Link to="/trending">Trending</Link>*/}
            <Link to="/trendingFeed">Trending</Link>
        </li>
    </Fragment>
);

class Header extends React.Component {
    handleSearch = () => {
        this.setState(prevState => {
            return {
                search: !prevState.search
            };
        });
    };
    handleCancel = () => {
        this.setState(prevState => {
            return {
                search: !prevState.search
            };
        });
    };

    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSelect = this.onSearchSelect.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            search: false,
            dataSource: [],
            options: [],
            noOfUnread: 0,
        };
    }

    componentDidMount() {
        this.props.client;
    }

    onSearchChange(value) {
        if (value === '') {
            this.setState({
                dataSource: [],
                options: []
            });
            return;
        }
        this.props.client.query({
            query: GET_SEARCH_USER_SELLER,
            variables: {
                input: value
            }
        }).then(({ data }) => {
            data = data.searchUsersAndSellers;
            let transformed = [
                ...data.sellers,
                ...data.users
            ];
            console.log(transformed);
            let options = transformed.map((item, index) => {
                return (
                    <Option key={item.username || item.shopName} original={item}>
                        <Row gutter={8}>
                            <Col span={5}>
                                <img className={'img-fluid'} src={item.image} alt="" />
                            </Col>
                            <Col span={19}>
                                {item.name}
                                {item.__typename === 'Seller' && (
                                    <img
                                        src="https://www.veloceinternational.com/wp-content/uploads/2017/08/1495368559287-300x300.png"
                                        className='verified'
                                        alt="" />
                                )}
                            </Col>
                        </Row>
                    </Option>
                );
            });
            options.unshift(<Option key={`/search/${value}`}>
                <Row gutter={8}>
                    <Link to={`/search/${value}`} />
                    <Col span={5}>
                        <img className={'img-fluid'}
                            src={'https://upload.wikimedia.org/wikipedia/commons/4/47/Hash.png'}
                            alt="" />
                    </Col>
                    <Col span={19}>
                        Search for #{value}
                    </Col>
                </Row>
            </Option>);
            this.setState({
                dataSource: transformed,
                options
            });
        });

    }

    onSearchSelect(value, option) {
        console.log(value, option);
        let item = option.props.original;
        if (item) {
            if (item.__typename === 'User') {
                this.props.history.push(`/user/${item.username}`);
            } else {
                this.props.history.push(`/shop/${item.shopName}`);
            }
        } else {
            this.props.history.push(value);
        }
        this.setState({
            search: false
        });
    }

    logout() {
        localStorage.clear();
        this.props.client.clearStore().then(data => {
            console.log("Logout");
            this.props.history.push('/');
        });
    }

    render() {

        // console.log(this.props.history.location.pathname);
        if (this.props.history.location.pathname.search("/auth/") === 0) {
            return <div></div>;
        }
        else
            return (
                <Query query={GET_AUTH}>
                    {({ data }) => {
                        return (
                            <div className="navbar_container">
                                {/* {console.log("Data: : ", data)} */}

                                <div className='container_40'>
                                    <ul className="nav_bar">
                                        {left_section}

                                        {data.auth.isAuthenticated && (
                                            <div className="float-right">


                                                {
                                                    this.state.search ? (
                                                        <li
                                                            style={{
                                                                paddingTop: '0px',
                                                                paddingBottom: '0px',
                                                                display: 'inline-flex'
                                                            }}
                                                        >
                                                            <AutoComplete
                                                                className={'custom-autocomplete'}
                                                                onSearch={this.onSearchChange}
                                                                dataSource={this.state.options}
                                                                onSelect={this.onSearchSelect}
                                                                onBlur={() => {
                                                                    this.setState({ search: false });
                                                                }}
                                                                optionLabelProp="name"
                                                            // onKeyPress={
                                                            //     e => {
                                                            //         if (e.key === 'Enter') {
                                                            //             this.props.history.push(`/search/${e.target.value}`);
                                                            //         }
                                                            //     }
                                                            // }
                                                            // onSearch={value => this.props.history.push(`/search/${value}`)}
                                                            // style={{width: '200px', border: 'none', borderRadius: '5%', borderColor: 'none', background: 'none'}}
                                                            >
                                                                <Input />
                                                            </AutoComplete>
                                                        </li>
                                                    ) : (
                                                            <li onClick={this.handleSearch}>
                                                                <Icon type='search' style={{ fontSize: 18 }} />
                                                            </li>
                                                        )
                                                }
                                                <li id="ex4">
                                                    <Popover placement="bottomLeft"
                                                        arrowPointAtCenter
                                                        title={text}
                                                        content={
                                                            <Notifs history={this.props.history} user={data} />
                                                        }
                                                        trigger="click">
                                                        <Icon type='bell' style={{ fontSize: 18 }} />
                                                        {/* <div id="notify-circle">1</div> */}
                                                    </Popover>
                                                </li>
                                                <li>
                                                    <Link to="/cart">
                                                        <Icon
                                                            type='shopping-cart'
                                                            style={{ fontSize: 18 }}
                                                        />
                                                    </Link>
                                                    {/* <div>{this.props.shopping_cart.length}</div> */}
                                                </li>

                                                <li style={{
                                                    border: 'solid 2px gray',
                                                    paddingTop: '0px',
                                                    paddingBottom: '0px',
                                                    marginLeft: '10px'
                                                }}>
                                                    <Link
                                                        to={`/user/${data.auth.user.username}`}>Hi {Object.keys(data).length > 0 ? `, ${data.auth.user.name}` : ""}</Link>
                                                </li>

                                                <li style={{
                                                    border: 'solid 2px gray',
                                                    paddingTop: '0px',
                                                    paddingBottom: '0px',
                                                    marginLeft: '10px'
                                                }}>
                                                    <Dropdown
                                                        overlay={<MenuI logout={this.logout} user={data.auth.user} />}
                                                        trigger={['click']}
                                                        placement='bottomRight'>
                                                        <a className="ant-dropdown-link">
                                                            <Icon type="down" />
                                                        </a>
                                                    </Dropdown>
                                                </li>
                                            </div>)}

                                        {!data.auth.isAuthenticated && (
                                            <div className="float-right">
                                                <li>
                                                    <Link to="/login">Login</Link>
                                                    {/* <div>{this.props.shopping_cart.length}</div> */}
                                                </li>
                                                <li>
                                                    <Link to="/signup">Register</Link>
                                                    {/* <div>{this.props.shopping_cart.length}</div> */}
                                                </li>
                                            </div>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        );

                    }}
                </Query>
            );
    }
};

export default withApollo(Header);
