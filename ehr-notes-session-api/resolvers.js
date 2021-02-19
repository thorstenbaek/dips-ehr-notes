import { PubSub, withFilter } from "apollo-server";
import {Session, Delta} from "./classes/Session.js";
import {Document} from "./classes/Document.js";
import documents from "./documents.js";

var sessions = []; //sessionData.map(d => new Session(d.documentId));
const pubsub = new PubSub();

var resolvers = {
    Query: {
        documents() {
            return documents.map(document => {
              console.log(sessions.length);
              var documentSession = sessions.filter(s => s.documentId == document.id);
              
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
        createSession: (_, args) => {            
            var session = new Session(
                    args.documentId, 
                    null);
            sessions.push(session);
                        
            pubsub.publish(["SESSION_CREATED"], {
              sessionCreated:{
                  documentId: session.documentId                  
              }
            }); 

            return session;
        },                  
        deleteSession: (_, args) => {
            sessions = sessions.filter(s => s.documentId !== args.documentId);

            pubsub.publish(["SESSION_DELETED"], {
              sessionDeleted: args.documentId                                
            });

            return args.documentId;
        }
    }, 

    Subscription: {        
      sessionCreated: {
        subscribe: () => pubsub.asyncIterator(["SESSION_CREATED"])
      },
      sessionDeleted: {
        subscribe: () => pubsub.asyncIterator(["SESSION_DELETED"])
    }
  }
}

export default resolvers;

