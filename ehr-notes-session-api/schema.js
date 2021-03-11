// Construct a schema, using GraphQL schema language

const typeDefs = `
  type Query {    
    sessions: [Session]
    session(document: String!): Session    
  }

  type Session {
      id: String
      document: String
      users: [String]
  }
  
  input DeltaInput {
    content: String
    start: Int
    stop: Int
  }
  
  type Mutation {
      createSession(document: String!, user: String!): Session
      deleteSession(document: String!, user: String!): String      
  }

  type Subscription {
    sessionCreated(document: String!): Session
    sessionChanged(document: String!): Session
    sessionDeleted(document: String!): Session
  }`;

export default typeDefs;