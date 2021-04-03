// Construct a schema, using GraphQL schema language

const typeDefs = `
  type Query {    
    sessions: [Session]
    session(id: String!): Session    
  }

  type Session {
      id: String!
      version: Int!
      document: String
      identifier: String!
      users: [String]
      color: String
  }
  
  input ChangeInput {
    id: String!    
    instance: String!
    version: Int
    delta: String    
  }

  type Change {
    id: String
    instance: String
    delta: String    
  }
  
  type Mutation {
      createSession(id: String!, document: String!, user: String!): Session
      deleteSession(id: String!, user: String!): String           
      flushSessions: String
      changeDocument(change: ChangeInput!): Change       
  }

  type Subscription {
    sessionCreated(id: String!): Session
    sessionChanged(id: String!): Session
    sessionDeleted(id: String!): Session
    documentChanged(id: String!): Change    
  }`;

export default typeDefs;

