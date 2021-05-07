import { PubSub, withFilter } from "apollo-server-express";

const pubsub = new PubSub();
pubsub.ee.setMaxListeners(30); 


const robotResolvers = {
    Mutation: {},
    Subscription: {
        entitiesChanged: {
            subscribe: withFilter(
              () => pubsub.asyncIterator(["ENTITIES_CHANGED"]),
              (payload, variables) => {   
                return payload.entitiesChanged.id === variables.id;
              })
          }
    }
}

export {robotResolvers, pubsub};
