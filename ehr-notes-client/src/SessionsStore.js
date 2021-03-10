import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { WebSocketLink } from "@apollo/client/link/ws";
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { setClient } from "svelte-apollo";

//export let sessionsUrl = "local.dips-ehr-notes-session-api.localhost";
export let sessionsUrl = "localhost:4000";

const init = () => {
    const httpLink = new HttpLink({
        uri: `http://${sessionsUrl}/graphql`
        });
        const wsLink = new WebSocketLink({
            uri: `ws://${sessionsUrl}/subscriptions`,		
        options: {
            reconnect: true
        }
        });

    const link = split(
        // split based on operation type
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
            );
        },
            wsLink,
            httpLink,
        );

    const client = new ApolloClient({
            link,
            cache: new InMemoryCache()
        });

    setClient(client);
};

export {init as initSessions};