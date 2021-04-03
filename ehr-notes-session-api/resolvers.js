import { PubSub, withFilter } from "apollo-server-express";

const pubsub = new PubSub();
pubsub.ee.setMaxListeners(30); 

var resolvers = {
    Query: {
        session: (_, args, {dataSources}) => {
            return dataSources.sessionManager.getById(args.id);            
          },
        
        sessions: (_, __, {dataSources}) => {
            return dataSources.sessionManager.all();
        },
    },

    Mutation: {
        createSession: (_, args, {dataSources}) => {               
            const result = dataSources.sessionManager.addSession(args.id, args.document, args.user);    
        
            if (result.created)
            {
              pubsub.publish(["SESSION_CREATED"], {
                sessionCreated: result.session}); 
            }
            else { 
              console.log(result.session);           
              pubsub.publish(["SESSION_CHANGED"], {                
                sessionChanged: result.session});     
            }
          
            return result.session;                        
        },                  
        deleteSession: (_, args, {dataSources}) => {          
            const result = dataSources.sessionManager.removeSession(args.id, args.user);    

            if (result.error)
            {
              return null;
            }
            
            if (result.deleted) {  
              pubsub.publish(["SESSION_DELETED"], {
                sessionDeleted: result.session                           
              });
              
            }
            else {
              pubsub.publish(["SESSION_CHANGED"], {
                sessionChanged: result.session
              });
            }

            return result.session.id;
        },
        flushSessions: (_, __, {dataSources}) => {
          var sessions = dataSources.sessionManager.flush();  
          sessions.map(s => {
            console.log(s)
            pubsub.publish(["SESSION_CHANGED"], {
              sessionDeleted: s                           
            });
          });
        },             
        changeDocument: (_, args, {dataSources}) => {
          var session = dataSources.sessionManager.getById(args.change.id);
          console.log("version", args.change.version);

          if (session) {
            // Sending the change to OT-server (session)
            var receivedChange = JSON.stringify(session.change(args.change.version, args.change.delta));            
          
            pubsub.publish(["DOCUMENT_CHANGED"], {                
                documentChanged: {
                  change: {
                    id: args.change.id,
                    identifier: args.change.identifier,
                    delta: receivedChange
                  }
                }
            });
            return receivedChange;
          }
        }
    }, 

    Subscription: {        
      sessionCreated: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(["SESSION_CREATED"]),
          (payload, variables) => {            
            return payload.sessionCreated.id === variables.id;
          })          
      },
      sessionChanged: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(["SESSION_CHANGED"]),
          (payload, variables) => {            
            return payload.sessionChanged.id === variables.id;
          })
      },
      sessionDeleted: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(["SESSION_DELETED"]),
          (payload, variables) => {
            return payload.sessionDeleted.id === variables.id;
          })
      },
      documentChanged: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(["DOCUMENT_CHANGED"]),
          (payload, variables) => {   
            console.log("withFilter", payload.documentChanged, variables.id) 
            return payload.documentChanged.change.id === variables.id;
          })
      }
  }
}

export default resolvers;

