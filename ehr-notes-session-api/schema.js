var { graphql, buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    documents: [Document]
    document(id: ID!): Document
  }

  input DeltaInput {
    content: String
    start: Int
    stop: Int
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

  type Mutation {
      createDocument(deltaInputs: [DeltaInput]): Document
      updateDocument(id: ID!, deltaInputs: [DeltaInput]): Document
  }
`);

module.exports = schema;