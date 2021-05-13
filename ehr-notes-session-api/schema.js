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
    users: [User]
    robot: Robot
    color: String
  }

  input UserInput {
    id: String!
    instance: String!
    color: String!
  }

  type User {
    id: String!
    instance: String!
    color: String!
  }

  type Entity {
    word: String!
    color: String!
    index: Int!
  }

  type Robot {
    name: String!
    entities: [Entity]
  }
  
  input ChangeInput {
    id: String!    
    instance: String!
    version: Int
    delta: String    
  }

  type Change {
    id: String!
    instance: String!
    delta: String
  }
  
  input SelectionInput {
    id: String!
    instance: String!
    start: Int!
    end: Int
  }
  
  type Selection {
    id: String!
    instance: String!
    start: Int!
    end: Int
  }  

  type Mutation {
    createSession(id: String!, document: String!, user: UserInput!): Session
    deleteSession(id: String!, user: String!): String           
    flushSessions: String
    changeDocument(change: ChangeInput!): Change       
    changeSelection(selection: SelectionInput!): Selection
  }

  type Subscription {
    sessionCreated(id: String!): Session
    sessionChanged(id: String!): Session
    sessionDeleted(id: String!): Session
    documentChanged(id: String!): Change    
    selectionChanged(id: String!): Selection
    entitiesChanged(id: String!): Robot
  }`;

export default typeDefs;