import crypto from "crypto";
import sessionData from "./sessions.js";
import {Session, Delta} from "./classes/Session.js";
import {Document} from "./classes/Document.js";
import documents from "./documents.js";

const sessions = sessionData.map(d => new Session(d.id, d.deltas));

var resolvers = {
    Query: {
        documents() {
            return documents.map(document => {
              var documentSession = sessions.filter(session => session.id === document.id);
              console.log(documentSession.length);                
              
              
                return new Document(
                  document.id,
                  document.title,
                  document.date,
                  document.author,
                  document.markdown,
                  documentSession[0] != null
                )
              
              
            })            
        },

        session: (_, args) => {
            var document = sessions.filter(d => d.id == args.id);
            if (document.length == 0) {
                throw new Error(`no document exists with id ${args.id}`);
            }
            return document[0];
          },
        
        sessions() {
            return sessions;
        },    
    },

    Mutation: {
        createSession: (_, args, {pubsub}) => {
            var id = crypto.randomBytes(10).toString("hex");        
            var deltas = args.deltaInputs.map(i => new Delta(i.content, i.start, i.stop));    
            
            var session = new Session(
                    id, 
                    deltas);
            sessions.push(session);
            
            pubsub.publish('session', {
                session:{
                    mutation: 'CREATED',
                    data: session
                }
              }); 

            return session;
          },
        
          updateSession: (_, args, {pubsub}) => {
            var filteredSessions = sessions.filter(d => d.id == args.id);
            if (filteredSessions.length == 0) {
                throw new Error(`no document exists with id ${args.id}`);
            }
            
            var session = filteredSessions[0];
            
            var deltas = args.deltaInputs.map(i => new Delta(i.content, i.start, i.stop));    
            session.addDeltas(deltas);

            pubsub.publish('session', {
                session:{
                    mutation: 'UPDATED',
                    data: session
                }
              }); 
            
            return session;
          },
    },   

    Subscription: {
        session:{
            subscribe(_, __, {pubsub}){
              return pubsub.asyncIterator('session');
            }
          }
    }
}

export default resolvers;

