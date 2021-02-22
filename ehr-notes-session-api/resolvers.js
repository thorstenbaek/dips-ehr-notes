import { PubSub, withFilter } from "apollo-server";
import {Session} from "./classes/Session.js";
import {Document} from "./classes/Document.js";
import { v4 } from "uuid";
import documents from "./documents.js";

var sessions = []; //sessionData.map(d => new Session(d.documentId));
const pubsub = new PubSub();

var resolvers = {
    Query: {
        documents() {
            return documents.map(document => {
              var documentSession = sessions.filter(s => s.documentId == document.id);
              console.log(documentSession.length);
              
                return new Document(
                  document.id,
                  document.title,
                  document.date,
                  document.author,
                  document.markdown,
                  documentSession[0]
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
            var byDocument = sessions.filter(s => s.documentId == args.documentId);
            if (byDocument.length == 0) {
              var session = new Session(
                v4(),
                args.documentId, 
                args.user);

              sessions.push(session);
                          
              pubsub.publish(["SESSION_CREATED"], {
                sessionCreated: session
              }); 

              return session;
            }
            else {
              byDocument[0].users = [...byDocument[0].users, args.user];
              pubsub.publish(["SESSION_CHANGED"], {
                sessionChanged: byDocument[0]                                
              });     

              return byDocument[0];
            }
            
        },                  
        deleteSession: (_, args) => {
            var byDocument = sessions.filter(s => s.documentId == args.documentId);
            if (byDocument.length == 0) {
              return;
            }

            if (byDocument[0].users.length > 1)
            {
              byDocument[0].users = byDocument[0].users.filter(u => u != args.user);
              pubsub.publish(["SESSION_CHANGED"], {
                sessionChanged: byDocument[0]                                
              });
              return;
            }

            sessions = sessions.filter(s => s.documentId != args.documentId);

            pubsub.publish(["SESSION_DELETED"], {
              sessionDeleted: args.documentId                                
            });

            return args.documentId;
        }
    }, 

    Subscription: {        
      sessionCreated: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(["SESSION_CREATED"]),
          (payload, variables) => {            
            return payload.sessionCreated.documentId === variables.documentId;
          })          
      },
      sessionChanged: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(["SESSION_CHANGED"]),
          (payload, variables) => {            
            return payload.sessionChanged.documentId === variables.documentId;
          })
      },
      sessionDeleted: {
        subscribe: () => pubsub.asyncIterator(["SESSION_DELETED"])
    }
  }
}

export default resolvers;

