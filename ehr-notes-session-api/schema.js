// Construct a schema, using GraphQL schema language

const typeDefs = `
  type Query {    
    sessions: [Session]
    session(id: ID!): Session    
    documents: [Document]
  }

  type Document {
    id: ID!
    title: String
    date: String
    author: String
    markdown: String
    session: Session
  }
    
  type Session {
      id: String
      documentId: ID
      users: [String]
  }
  
  input DeltaInput {
    content: String
    start: Int
    stop: Int
  }
  
  type Mutation {
      createSession(documentId: ID!, user: String!): Session
      deleteSession(documentId: ID!, user: String!): ID
  }

  type Subscription {
    sessionCreated(documentId: ID!): Session,
    sessionChanged(documentId: ID!): Session,
    sessionDeleted: ID
  }
  
  `;

export default typeDefs;