import { PubSub, withFilter } from "apollo-server-express";

const pubsub = new PubSub();
pubsub.ee.setMaxListeners(30); 

var resolvers = {
    Query: {
        session: (_, args, {dataSources}) => {
            return dataSources.sessionManager.getByDocument(args.document);            
          },
        
        sessions: (_, __, {dataSources}) => {
            return dataSources.sessionManager.all();
        },
    },

    Mutation: {
        createSession: (_, args, {dataSources}) => {               
            const result = dataSources.sessionManager.addSession(args.document, args.user);    
        
            if (result.created)
            {
              pubsub.publish(["SESSION_CREATED"], {
                sessionCreated: result.session}); 
            }
            else {            
              pubsub.publish(["SESSION_CHANGED"], {
                sessionChanged: result.session});     
            }
          
            return result.session;                        
        },                  
        deleteSession: (_, args, {dataSources}) => {          
            const result = dataSources.sessionManager.removeSession(args.document, args.user);    

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
        changeDocument: (_, args, {dataSources}) => {
          var session = dataSources.sessionManager.getByDocument(args.change.document);
          if  (session && session.users.length > 1) {  
            var change = args.change;
            pubsub.publish(["DOCUMENT_CHANGED"], {                
                documentChanged: change
            });
            console.log(change);
            return change;
          }
        }
    }, 

    Subscription: {        
      sessionCreated: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(["SESSION_CREATED"]),
          (payload, variables) => {            
            return payload.sessionCreated.document === variables.document;
          })          
      },
      sessionChanged: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(["SESSION_CHANGED"]),
          (payload, variables) => {            
            return payload.sessionChanged.document === variables.document;
          })
      },
      sessionDeleted: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(["SESSION_DELETED"]),
          (payload, variables) => {
            return payload.sessionDeleted.document === variables.document;
          })
      },
      documentChanged: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(["DOCUMENT_CHANGED"]),
          (payload, variables) => {    
            return payload.documentChanged.document === variables.document;
          })
      }
  }
}

export default resolvers;

