import React from 'react';
import {Redirect} from 'react-router-dom' ;
import {Query} from 'react-apollo';
import {GET_LOGIN_STATUS} from "../query";
import jwt from "jsonwebtoken";

// TODO : Specify A Return Path ?return_url=something

export default function (ComposedComponent) {
    class Authenticate extends React.Component {
        render() {
            return (
                <Query query={GET_LOGIN_STATUS}>
                    {({data}) => {
                        console.log("Data From Reuire Auth", data);
                        if (!data.auth.isAuthenticated) {
                            return <Redirect
                                to={{
                                    pathname: "/",
                                    state: {from: this.props.location}
                                }}
                            />;
                        } else {
                            const token = localStorage.getItem("token");
                            const isSignupFinished = jwt.decode(token).finished;

                            if (this.props.location.pathname !== "/signup/complete") {  // to avoid infinite calls
                                if (isSignupFinished) {
                                    return (
                                        <ComposedComponent {...this.props} />
                                    );
                                } else {
                                    return <Redirect 
                                        to={{
                                            pathname: "/signup/complete",
                                            state: {from: this.props.location}
                                        }}
                                    />;
                                }
                            } else {
                                return (
                                    <ComposedComponent {...this.props} />
                                );
                            }
                        }
                    }}
                </Query>
            );

        }
    }

    return Authenticate;
}