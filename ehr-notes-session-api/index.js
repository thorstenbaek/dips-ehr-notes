import { GraphQLServer, PubSub }  from 'graphql-yoga';
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";

const pubsub = new PubSub();
const server = new GraphQLServer(
    { 
        typeDefs, 
        resolvers,
        context: {
            pubsub
        }
    })
server.start(() => console.log('Server is running on localhost:4000'))