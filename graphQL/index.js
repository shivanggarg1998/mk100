import saveAssetsToAWS from "./middlewares/saveToAWS";

const {ApolloServer, gql} = require('apollo-server-express');
import graphqlHTTP from 'express-graphql';
import {apolloUploadExpress} from 'apollo-upload-server';
import config from './config';
import jwt from 'jsonwebtoken';
import express from 'express';
import bodyParser from 'body-parser' ;

import cors from 'cors';
import {ccAvenueRedirectCallback} from './middlewares/ccAvenueResponse';

let app = express();
const PORT = 4000;
const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/callback/ccAvenue/redirect', ccAvenueRedirectCallback);
app = saveAssetsToAWS(app);

// app.use('/push', require('./push'));
//Public Key:
// BImBf1MZPoA5x-HrDlQoODpFY0mmshS9t_dGTLfHNBZNt8WsxcquRsYnr9J61Fu44MxKUQyaXUBdz9yJlzElVyM

// Private Key:
// QSKojmLYRF_MAP_zWxMUckT3kk8faHak4wf4Jxqu0fk


// GraphQL imports
const typeDefs = require('./typeDef/index');
const resolvers = require('./resolvers/index');

// Mongoose configuration
// const url = "mongodb://localhost:27017/ecomm";
const url = config.mongo_url;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        // get the user token from the headers
        // console.log('On Server');
        let token = req.headers.authorization || '';
        if (token === '') {
            console.log('No Token');
            return {
                user: {},
                seller: {}
            };
        }
        token = token.split(" ")[1];
        // console.log(token);
        // console.log("TOKEN", token);
        let decoded = {};
        // try to retrieve a user with the token
        // try {
        decoded = jwt.verify(token, config.secret);
        // } catch (TokenExpiredError) {
        //     console.log("Error");
        //     decoded = {};
        // }
        console.log("k",decoded);
        // const user = getUser(token);

        // console.log("DECODED", decoded);

        if (decoded.seller) {
            return {seller: decoded};
        } else if (decoded.admin) {
            return {admin: decoded};
        }

        // add the user to the context
        return {user: decoded};
    },
    formatError: error => {
        console.log(error);
        // return new Error('Internal server error');
        // Or, you can delete the exception information
        delete error.extensions.exception;
        return error;
    },
    playground: {
        settings: {
            'editor.theme': 'light',
            'editor.cursorShape': 'line',
        },
    }
});

server.applyMiddleware({app});

mongoose.connect(url, {useNewUrlParser: true}).then(() => {
    console.log("Connected to DB");
    const ser = app.listen({port: PORT}, () => {
        console.log(`Server ready at Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
    ser.setTimeout(10 * 60 * 1000);

}).catch(err => {
    console.log(err.message);
});

