import _ from "lodash";
import express from "express";
import http from "http";
import { ApolloServer, PubSub }  from 'apollo-server-express';
import typeDefs from "./schema.js";
import sessionResolvers from "./sessionResolvers.js";
import documentResolvers from "./documentResolvers.js";
import selectionResolvers from "./selectionResolvers.js";
import SessionManager from './classes/SessionManager.js';
import { request, gql } from 'graphql-request'

const app = express();
const port = process.env.PORT || 4000;
const sessionManager = new SessionManager();
const resolvers = _.merge({}, sessionResolvers, documentResolvers, selectionResolvers);
console.log(resolvers);

const server = new ApolloServer(
    { 
        typeDefs, 
        resolvers,
        dataSources: () => ({
          sessionManager: sessionManager,          
        }),
        subscriptions: {
            path: '/subscriptions',
            onConnect: (connectionParams, webSocket, context) => {
              console.log('Client connected');
            },
            onDisconnect: (webSocket, context) => {
              console.log('Client disconnected')
            },
          },
    })

const httpServer = http.createServer(app);

server.applyMiddleware({
    app,
    cors: true,
    path: "/graphql"
  });
server.installSubscriptionHandlers(httpServer);

app.use((req, res, next) => {          
  console.log(`${req.method}: ${req.originalUrl}`);
  next();
});

app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

app.post("/api/deleteSession", (req, res) => {
  if (req.query.id && req.query.user)
  {

    const mutation = gql`
        mutation($id: String!, $user: String!) { 
            deleteSession(id:$id, user:$user) 
        }
    `;

    const variables = {
        id: req.query.id, 
        user: req.query.user
      }

    request(`http://localhost:${port}/graphql`, mutation, variables).then(data => {
      console.log(data);
      res.status(200).send("OK");
    });
  }
  else
  {
    res.status(500).send("Error");
  }
  
});

httpServer.listen(port, () => {
  console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`,
  );
})
    