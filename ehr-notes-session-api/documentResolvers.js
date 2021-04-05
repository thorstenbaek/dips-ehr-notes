import { PubSub, withFilter } from "apollo-server-express";

const pubsub = new PubSub();
pubsub.ee.setMaxListeners(30); 

var documentResolvers = {
    Mutation: {
        changeDocument: (_, args, {dataSources}) => {            
            var session = dataSources.sessionManager.getById(args.change.id);            
            if (session) {
                // Sending the change to OT-server (session)
                var receivedChange = JSON.stringify(session.change(args.change.version, args.change.delta));                                        
                pubsub.publish(["DOCUMENT_CHANGED"], {                
                    documentChanged: {
                        id: session.id,
                        instance: args.change.instance,
                        delta: receivedChange
                    }
                });
                return receivedChange;
            }
        },        
    },
    Subscription: {
        documentChanged: {
            subscribe: withFilter(
              () => pubsub.asyncIterator(["DOCUMENT_CHANGED"]),
              (payload, variables) => {   
                return payload.documentChanged.id === variables.id;
              })
          }
    }
}

export default documentResolvers