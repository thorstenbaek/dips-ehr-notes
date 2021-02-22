import { ApolloServer }  from 'apollo-server';
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";

const server = new ApolloServer(
    { 
        typeDefs, 
        resolvers,
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

    


server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
    