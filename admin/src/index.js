import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ApolloProvider} from "react-apollo";
// import ApolloClient from "apollo-boost";

import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {withClientState} from 'apollo-link-state';
import {ApolloLink, Observable} from 'apollo-link';
import jwt from 'jsonwebtoken';

import Container from './components/Container';
import Login from './components/Login';
import RequireAuth from "./components/Utils/RequireAuth";

import './main.css';
import "react-table/react-table.css";

let token = localStorage.getItem("token");

let found = false;
if (token) {
    found = true;
}

let auth = {
    isAuthenticated: found,
    user: {
        id: "",
        name: "",
        username: "",
        ...jwt.decode(token),
        __typename: "AuthUser"
    },
    __typename: "Auth"
};

const cache = new InMemoryCache();

const request = async (operation) => {
    const getToken = localStorage.getItem('token');
    operation.setContext({
        headers: {
            authorization: getToken ? `Bearer ${getToken}` : ""
        }
    });
};

const requestLink = new ApolloLink((operation, forward) =>
    new Observable(observer => {
        let handle;
        Promise.resolve(operation)
            .then(oper => request(oper))
            .then(() => {
                handle = forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
            })
            .catch(observer.error.bind(observer));

        return () => {
            if (handle) handle.unsubscribe();
        };
    })
);

// const BASE_URL = 'http://localhost:4000/graphql';
const BASE_URL = 'http://206.189.134.51:4000/graphql';


const client = new ApolloClient({
    // connectToDevTools: true,
    link: ApolloLink.from([
        onError(({graphQLErrors, networkError}) => {
            if (graphQLErrors) {
                graphQLErrors.forEach(({message, locations, path}) => {
                    if (message === 'Context creation failed: jwt expired') {
                        console.log('Token Expired');
                        localStorage.removeItem('token');
                        window.location.reload();
                    } else {
                        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,);
                    }

                });
            }
            if (networkError) {
                console.log(`[Network error]: ${networkError}`);
            }
        }),
        requestLink,
        withClientState({
            defaults: {
                auth: auth
            },
            resolvers: {
                Mutation: {
                    updateAuth: (_, params, {cache}) => {
                        let token = localStorage.getItem("token");
                        let found = false;
                        if (token) {
                            found = true;
                        }

                        let auth = {
                            isAuthenticated: found,
                            user: {...jwt.decode(token), __typename: "AuthUser"},
                            __typename: "Auth"
                        };

                        cache.writeData({data: {auth}});
                        return null;
                    }
                }
            },
            cache
        }),
        new HttpLink({
            uri: BASE_URL,
        })
    ]),
    cache
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={Login}/> 
                <Route path="/" component={RequireAuth(Container)}/>
            </Switch>
        </BrowserRouter>
    </ApolloProvider>,

    document.getElementById('root'));
