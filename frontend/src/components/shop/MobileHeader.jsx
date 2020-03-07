import React, { Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import {Col, Dropdown, Icon, AutoComplete, Input, Menu, Popover, Row} from "antd";
import {Query, withApollo} from "react-apollo";
import {GET_AUTH, GET_SEARCH_USER_SELLER} from "./../query";
import Notifs from './Notification';
import {categories} from './Header/categories';

// TODO: Add User Notifications

const Search = Input.Search;
const Option = AutoComplete.Option;
const text = <span style={{fontSize: '18px', fontWeight: '600'}}> Notifications</span>;

const menu = (
    <div className="categories">
        <Row>
            {
                categories.map((category, index) => (
                    <Col span={8} key={index}>
                        <ul className="categories__list" >
                            <strong>
                                <li>{category.name}</li>
                            </strong>
                            {
                                category.items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))
                            }
                        </ul>
                    </Col>

                ))
            }
        </Row>
    </div>
);

class MobileHeader extends React.Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSelect = this.onSearchSelect.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            search: false,
            expand: false,
            dataSource: [],
            options: []
        };
    }

    handleSearch = () => {
        this.setState(prevState => {
            return {
                search: !prevState.search
            };
        });
    };

    handleClick = () => {
        this.setState(prevState => {
            return {
                expand: !prevState.expand
            };
        });
    }

    handleCancel = () => {
        this.setState(prevState => {
            return {
                search: !prevState.search
            };
        });
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
        }).then(({data}) => {
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
                                <img className={'img-fluid'} src={item.image} alt=""/>
                            </Col>
                            <Col span={19}>
                                {item.name}
                                {item.__typename === 'Seller' && (
                                    <img src="https://www.veloceinternational.com/wp-content/uploads/2017/08/1495368559287-300x300.png"
                                         className='verified'
                                         alt=""/>
                                )}
                            </Col>
                        </Row>
                    </Option>
                );
            });
            options.push(<Option key={`/search/${value}`}>
                <Row gutter={8}>
                    <Link to={`/search/${value}`}/>
                    <Col span={5}>
                        <img className={'img-fluid'}
                             src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV9e0xcioHeH_3D7blQUumfnZQEgdveoWYdhEtP8qgGEN_xSxf'}
                             alt=""/>
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
        let item = option.props.original ;
        if(item) {
            if(item.__typename === 'User'){
                this.props.history.push(`/user/${item.username}`)
            } else {
                this.props.history.push(`/shop/${item.shopName}`)
            }
        } else {
            this.props.history.push(value);
        }
        this.setState({
            search : false
        })
    }


    logout() {
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

        if (this.props.history.location.pathname.search("/auth/") === 0) {
            return <div></div>;
        }
        else
            return (
                <Query query={GET_AUTH}>
                    {({data}) => (
                        <div className="navbar_container">
                            <nav className="navbar navbar-dark" style={{backgroundColor: 'rgb(40,40,40)', padding: '0'}}>
                                <div className="mobile_header">
                                    <div className="brand"><Link to="/">MK100</Link></div>
                                    
                                    {
                                        data.auth.isAuthenticated && (
                                            <div className="icons">
                                                <div>
                                                {
                                                    this.state.search ? (
                                                        // <div>
                                                        //     <input
                                                        //         placeholder="Search Text"
                                                        //         type="text"
                                                        //         onKeyPress = {
                                                        //             e => {
                                                        //                 if (e.key == 'Enter') {
                                                        //                     this.props.history.push(`/search/${e.target.value}`)
                                                        //                 }
                                                        //             }
                                                        //         }
                                                        //     />
                                                        //     <button 
                                                        //         onClick={this.handleCancel}
                                                        //         className="search_cancel"
                                                        //     >
                                                        //         X
                                                        //     </button>
                                                        // </div>
                                                        <div>
                                                            <AutoComplete
                                                                className={'custom-autocomplete'}
                                                                onSearch={this.onSearchChange}
                                                                dataSource={this.state.options}
                                                                onSelect={this.onSearchSelect}
                                                                onBlur={() => {
                                                                    this.setState({search : false})
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
                                                                <Input/>
                                                            </AutoComplete>
                                                        </div>
                                                    ) : (
                                                        <div onClick={this.handleSearch}>
                                                            <Icon type='search' style={{fontSize: 18}}/>
                                                        </div>
                                                    )
                                                }
                                                </div>
                                                
                                                <div>
                                                    <Link to="/cart">
                                                        <Icon type='shopping-cart' style={{fontSize: 18}}/>
                                                    </Link>
                                                </div>

                                                <div>
                                                    <Popover placement="bottomRight" title={text} content={"No Notifications Yet."} trigger="click">
                                                        <Icon type='bell' style={{fontSize: 18}}/>
                                                    </Popover>
                                                </div>
                                            </div>
                                        )
                                    }
                                    
                                    <button className="navbar-toggler" type="button" onClick={this.handleClick}>
                                        <span className="navbar-toggler-icon"/>
                                    </button>
                                </div>
                                <div className={`collapse navbar-collapse ${this.state.expand ? 'show' : ''}`} id="navbarNav">
                                    <ul className="navbar-nav">
                                        {
                                            data.auth.isAuthenticated && (
                                                <Fragment>
                                                    <li className="nav-item active">
                                                        <Link to={`/user/${data.auth.user.username}`}>Hi {Object.keys(data).length > 0 ? `, ${data.auth.user.name}` : ""}</Link>
                                                    </li>
                                                    <li className="nav-item active">
                                                        <Link to="/feed">My Feed</Link>
                                                    </li>
                                                    <li className="nav-item active">
                                                        <Link to="/trendingFeed">Trending</Link>
                                                    </li>
                                                    <li className="nav-item active">
                                                        <Link to="/orders">Order</Link>
                                                    </li>
                                                    <li className="nav-item active">
                                                        <Link to="/chat">Chat</Link>
                                                    </li>
                                                    <li className="nav-item active">
                                                        <a onClick={this.logout}>Logout</a>
                                                    </li>
                                                </Fragment>
                                            )
                                        }
                                        <li className="nav-item active" style={{cursor: 'pointer'}}>
                                            <Dropdown overlay={menu} trigger={["click"]}>
                                                <span>Categories</span>
                                            </Dropdown>
                                        </li>
                                        {
                                            !data.auth.isAuthenticated && (
                                                <Fragment>
                                                    <li className="nav-item active">
                                                        <Link to="/login">Login</Link>
                                                    </li>
                                                    <li className="nav-item active">
                                                        <Link to="/signup">Register</Link>
                                                    </li>
                                                </Fragment>
                                            )
                                        }

                                    </ul>
                                </div>
                            </nav>
                        </div>
                    )}
                </Query>
            )
    }
};

export default withApollo(MobileHeader);
