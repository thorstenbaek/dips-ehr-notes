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
  
  input ChangeInput {
    document: String
    instance: String
    content: String    
  }

  type Change {
    document: String
    content: String
    instance: String
  }
  
  type Mutation {
      createSession(document: String!, user: String!): Session
      deleteSession(document: String!, user: String!): String     
      changeDocument(change: ChangeInput!): Change 
  }

  type Subscription {
    sessionCreated(document: String!): Session
    sessionChanged(document: String!): Session
    sessionDeleted(document: String!): Session
    documentChanged(document: String!): Change    
  }`;

export default typeDefs;

