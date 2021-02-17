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
      id: ID!
      deltas: [Delta]
  }
  
  input DeltaInput {
    content: String
    start: Int
    stop: Int
  }
  
  type Mutation {
      createSession(deltaInputs: [DeltaInput]): Session
      updateSession(id: ID!, deltaInputs: [DeltaInput]): Session
  }
  
  type DeltaSubscriptionPayload {
      mutation: String!
      data: Session!
  }

  type Subscription {
    session: DeltaSubscriptionPayload
  }`;

export default typeDefs;