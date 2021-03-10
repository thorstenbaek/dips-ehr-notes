import express from "express";
import http from "http";
import { ApolloServer }  from 'apollo-server-express';
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";
import SessionManager from './classes/SessionManager.js';

const app = express();
const port = process.env.PORT || 4000;
const sessionManager = new SessionManager();

const server = new ApolloServer(
    { 
        typeDefs, 
        resolvers,
        dataSources: () => ({
          sessionManager: sessionManager
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

server.applyMiddleware({app});
server.installSubscriptionHandlers(httpServer);

app.use("/api/deleteSession", (req, res) => {
  if (req.query.document && req.query.user)
  {
    var removed = sessionManager.removeSession(req.query.document, req.query.user);
    if (removed != null)
    {
      res.status(200).send("OK");
    }
    else
    {
      res.status(404).send("Not found");
    }    
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
    