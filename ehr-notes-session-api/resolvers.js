import crypto from "crypto";
import documentData from "./documents.js";

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

const documents = documentData.map(d => new Document(d.id, d.deltas));

var resolvers = {
    Query: {
        document: (parent, args) => {
            var document = documents.filter(d => d.id == args.id);
            if (document.length == 0) {
                throw new Error(`no document exists with id ${args.id}`);
            }
            return document[0];
          },
        
        documents() {
            return documents;
        },    
    },

    Mutation: {
        createDocument: (parent, args, {pubsub}) => {
            var id = crypto.randomBytes(10).toString("hex");        
            var deltas = args.deltaInputs.map(i => new Delta(i.content, i.start, i.stop));    
            
            var document = new Document(
                    id, 
                    deltas);
            documents.push(document);
            
            pubsub.publish('document', {
                document:{
                    mutation: 'CREATED',
                    data: document
                }
              }); 

            return document;
          },
        
          updateDocument: (_, args, {pubsub}) => {
            var document = documents.filter(d => d.id == args.id);
            if (document.length == 0) {
                throw new Error(`no document exists with id ${args.id}`);
            }
            
            var document = documents[0];
            
            var deltas = args.deltaInputs.map(i => new Delta(i.content, i.start, i.stop));    
            document.addDeltas(deltas);

            pubsub.publish('document', {
                document:{
                    mutation: 'UPDATED',
                    data: document
                }
              }); 
            
            return document;
          },
    },   

    Subscription: {
        document:{
            subscribe(parent, args, {pubsub}){
              return pubsub.asyncIterator('document');
            }
          }
    }
}

export default resolvers;

