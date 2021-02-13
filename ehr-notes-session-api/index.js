import { GraphQLServer }  from 'graphql-yoga';
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))