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
    hasSession: Boolean
  }
  
  type Delta {
    content: String
    start: Int
    stop: Int
  }
  
  type Session {
      documentId: ID
      deltas: [Delta]
  }
  
  input DeltaInput {
    content: String
    start: Int
    stop: Int
  }
  
  type Mutation {
      createSession(documentId: ID!): Session
      deleteSession(documentId: ID!): ID
  }

  type Subscription {
    sessionCreated: Session,
    sessionDeleted: ID
  }
  
  `;

export default typeDefs;