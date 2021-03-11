import express from "express";
import http from "http";
import fetch from "node-fetch";
import { ApolloServer, PubSub }  from 'apollo-server-express';
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";
import SessionManager from './classes/SessionManager.js';
import { request, gql } from 'graphql-request'

const app = express();
const port = process.env.PORT || 4000;
const sessionManager = new SessionManager();

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
  if (req.query.document && req.query.user)
  {

    const mutation = gql`
        mutation($document: String!, $user: String!) { 
            deleteSession(document:$document, user:$user) 
        }
    `;

    const variables = {
        document: "b3e32146-848c-4d3b-b8a9-c9b3a7861a6a", 
        user:"f58db7ee-0c33-43e3-8f91-c33bd9255455"
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
    