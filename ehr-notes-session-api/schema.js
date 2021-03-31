// Construct a schema, using GraphQL schema language

const typeDefs = `
  type Query {    
    sessions: [Session]
    session(document: String!): Session    
  }

  type Session {
    id: String
    delta: String
    users: [String]
  }

  input SessionInput {
    id: String
    delta: String
    user: String
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
      createSession(session: SessionInput): Session
      deleteSession(id: String!, user: String!): String           
      flushSessions: String
      changeDocument(change: ChangeInput!): Change       
  }

  type Subscription {
    sessionCreated(id: String!): Session
    sessionChanged(id: String!): Session
    sessionDeleted(id: String!): Session
    documentChanged(document: String!): Change    
  }`;

export default typeDefs;

/*

type Document {
    id: String
    content: String
  }

  input DeltaInput {
    id: String
    delta: Delta
  }


*/