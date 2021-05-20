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
    robots: [Robot]
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

  type RobotResult {
    name: String!   
    entities: [Entity] 
    enabled: Boolean
  }

  type Robot {
    name: String!   
    enabled: Boolean
  }

  input RobotInput {
    name: String!
    enabled: Boolean
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
    enableRobot(session: String!, name: String!): Robot
    disableRobot(session: String!, name: String!): Robot
  }

  type Subscription {
    sessionCreated(id: String!): Session
    sessionChanged(id: String!): Session
    sessionDeleted(id: String!): Session
    documentChanged(id: String!): Change    
    selectionChanged(id: String!): Selection
    entitiesChanged(id: String!): RobotResult
  }`;

export default typeDefs;