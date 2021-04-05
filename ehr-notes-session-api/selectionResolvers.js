import { PubSub, withFilter } from "apollo-server-express";

const pubsub = new PubSub();
pubsub.ee.setMaxListeners(30); 

var selectionResolvers = {
    Mutation: {
        changeSelection: (_, args, {dataSources}) => {    
            console.log("ChangeSelection", args);        
            var session = dataSources.sessionManager.getById(args.selection.id);            
            if (session) {
                pubsub.publish(["SELECTION_CHANGED"], {                
                    selectionChanged: {
                        id: session.id,
                        instance: args.selection.instance,
                        start: args.selection.start,
                        end: args.selection.end
                    }
                });
                return args.selection;
            }
        },        
    },
    Subscription: {
        selectionChanged: {
            subscribe: withFilter(
              () => pubsub.asyncIterator(["SELECTION_CHANGED"]),
              (payload, variables) => {   
                return payload.selectionChanged.id === variables.id;
              })
          }
    }
}

export default selectionResolvers