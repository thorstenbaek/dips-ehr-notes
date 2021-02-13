var express = require("express");
var crypto = require("crypto");
var { graphqlHTTP } = require("express-graphql");
var { graphql, buildSchema } = require('graphql');
var schema = require("./schema");

const port = 4000;

var documents = [];

class Document {
    constructor(id, deltas) {
        this.id = id;
        this.deltas = deltas;
    }

    addDeltas(deltas)
    {
        this.deltas.push(...deltas);
    }

}

class Delta {
    constructor(content, start, stop) {
        this.content = content;
        this.start = start;
        this.stop = stop;
    }    
}
 
// The root provides a resolver function for each API endpoint
var root = {
  createDocument: (argument) => {
    var id = crypto.randomBytes(10).toString("hex");        
    var deltas = argument.deltaInputs.map(i => new Delta(i.content, i.start, i.stop));    
    
    var document = new Document(
            id, 
            deltas);
    documents.push(document);
    
    return document;
  },

  updateDocument: (argument) => {
    var document = documents.filter(d => d.id == argument.id);
    if (document.length == 0) {
        throw new Error(`no document exists with id ${argument.id}`);
    }
    
    var document = documents[0];
    
    var deltas = argument.deltaInputs.map(i => new Delta(i.content, i.start, i.stop));    
    document.addDeltas(deltas);
    
    return document;
  },
  
  document: (id) => {
    var document = documents.filter(d => d.id == id.id);
    if (document.length == 0) {
        throw new Error(`no document exists with id ${id.id}`);
    }
    return document[0];
  },

  documents: () => {
    console.log(documents);
    return documents;
  },    

  post: () => {

  }
};
 
var app = express();
app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(port);
console.log(`Running GraphQL API server at ${port}`);