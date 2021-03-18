
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { WebSocketLink } from "@apollo/client/link/ws";
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { setClient, mutation, subscribe } from "svelte-apollo";
import gql from 'graphql-tag';
import { get, writable } from "svelte/store";
import { user } from "./SmartOnFhirStore";
import { settings } from "./stores";
import UrlBuilder from "./UrlBuilder";

export let session = writable(null);

let urlBuilder;
let createSessionMutation;
let sessionChangedSubscription;
let sessionChangedUnsubscriber;

let changeDocumentMutation;
let documentChangedSubscription;
let documentChangedUnsubscriber;

        
const init = () => {
    urlBuilder = new UrlBuilder(get(settings).SessionsApiUrl);
    
    const httpLink = new HttpLink({uri: urlBuilder.getGraphQLUrl()});
        const wsLink = new WebSocketLink({
            uri: urlBuilder.getSubscriptionsUrl(),		
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

    const CREATESESSION_MUTATION = gql`    
    mutation($document: String!, $user: String!){
        createSession(document: $document, user: $user) {
            id
            document,
            users
        }
    }`;
    createSessionMutation = mutation(CREATESESSION_MUTATION);        

    const CHANGEDOCUMENT_MUTATION = gql`
        mutation($change: ChangeInput!){
            changeDocument(change: $change) {
                content
            }
        }`;
    changeDocumentMutation = mutation(CHANGEDOCUMENT_MUTATION);              
};

async function createSession(document) {
    console.log("Create session ", document.id, get(user).id);
        
    var result = await createSessionMutation({
        variables: {                
            document: document.id,
            user: get(user).id
    }})
    
    session.set(result.data.createSession);        
}

function deleteSession() {    
    const url = `${urlBuilder.getBaseUrl()}/api/deleteSession?document=${get(session).document}&user=${get(user).id}`;            
    fetch(url, {
        method: "post",
        mode: "cors",                        
        keepalive: true // needed when fetch is called from 
    });
    if (sessionChangedUnsubscriber != null)
        sessionChangedUnsubscriber();
    if (documentChangedUnsubscriber != null)
        documentChangedUnsubscriber();
}

function subscribeForSessionChanges(document) {
    console.log("Subscribing for changes to session for " + document.id);
    
    const SESSIONCHANGED_SUBSCRIPTION = gql`
    subscription($document:String!) {
        sessionChanged(document:$document) {
            id 
            document
            users
        }
    }`;       
    
    sessionChangedSubscription = subscribe(SESSIONCHANGED_SUBSCRIPTION, {
        variables: {
            document: document.id
    }});

    sessionChangedUnsubscriber = sessionChangedSubscription.subscribe(        
        result => {              
            if (result.data)
            {
                const newSession = {
                    id: result.data.sessionChanged.id,
                    document: result.data.sessionChanged.document,
                    users: result.data.sessionChanged.users
                };

                session.set(newSession);                        
            }
            else
            {
                session.set(null);
            }
        });
}

function subscribeForDocumentChanges(callback, instance, document) {
    console.log("Subscribing for changes to document " + document.id);

    const DOCUMENTCHANGED_SUBSCRIPTION = gql`
        subscription($document:String!) {
            documentChanged(document:$document) {
                content, instance
            }
        }`;         
    documentChangedSubscription = subscribe(DOCUMENTCHANGED_SUBSCRIPTION, {
        variables: {            
            document: document.id
    }});
    
    documentChangedUnsubscriber = documentChangedSubscription.subscribe(        
        result => {            
            if (result?.data?.documentChanged)
            {
                callback(result.data.documentChanged);
            }
        });

}

async function changeDocument(document, instance, content) {
    var result = await changeDocumentMutation({
        variables: {                
            change: {document: document, instance: instance, content: content}            
    }})    

    if (result.data == null) {
        console.error("Failed to send document changed")
    }
}


export {init as initSessions, createSession, deleteSession, subscribeForSessionChanges, changeDocument, subscribeForDocumentChanges};