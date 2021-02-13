// Construct a schema, using GraphQL schema language

const typeDefs = `
  type Query {    
    documents: [Document]
    document(id: ID!): Document    
  }
  type Delta {
    content: String
    start: Int
    stop: Int
  }
  type Document {
      id: ID!
      deltas: [Delta]
  }
  
  input DeltaInput {
    content: String
    start: Int
    stop: Int
  }
  
  type Mutation {
      createDocument(deltaInputs: [DeltaInput]): Document
      updateDocument(id: ID!, deltaInputs: [DeltaInput]): Document
  }`;

export default typeDefs;