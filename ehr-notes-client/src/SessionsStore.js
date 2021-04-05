
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
    mutation($id: String!, $document: String!, $user: String!){
        createSession(id: $id, document: $document, user: $user) {
            id, version, document, identifier, users
        }
    }`;
    createSessionMutation = mutation(CREATESESSION_MUTATION);        

    const CHANGEDOCUMENT_MUTATION = gql`
        mutation($change: ChangeInput!){
            changeDocument(change: $change) {
                delta
            }
        }`;
    changeDocumentMutation = mutation(CHANGEDOCUMENT_MUTATION);              
};

async function createSession(id, document) {
    console.log("Create session ", id, get(user).id);
        
    var result = await createSessionMutation({
        variables: {       
            id: id,         
            document: document,
            user: get(user).id
    }})
    
    session.set(result.data.createSession);        
}

function deleteSession() {  
    console.log("Deleting session");
    const url = `${urlBuilder.getBaseUrl()}/api/deleteSession?id=${get(session).id}&user=${get(user).id}`;            
    fetch(url, {
        method: "post",
        mode: "cors",                        
        keepalive: true // needed when fetch is called from unload or pagehide
    });
    session.set(null);
    console.log("Deleted session");
    
    if (sessionChangedUnsubscriber != null)
        sessionChangedUnsubscriber();
    if (documentChangedUnsubscriber != null)
        documentChangedUnsubscriber();
}

function subscribeForSessionChanges(id) {
    const SESSIONCHANGED_SUBSCRIPTION = gql`
    subscription($id:String!) {
        sessionChanged(id:$id) {
            id, version, users
        }
    }`;       
    
    sessionChangedSubscription = subscribe(SESSIONCHANGED_SUBSCRIPTION, {
        variables: {
            id: id
    }});

    sessionChangedUnsubscriber = sessionChangedSubscription.subscribe(        
        result => {   
            if (result.data) {
                session.set(result.data.sessionChanged);                        
            } else {
                session.set(null);
            }
        });
}

function subscribeForDocumentChanges(callback, id) {
    console.log("Subscribing for changes to document " + id);

    const DOCUMENTCHANGED_SUBSCRIPTION = gql`
        subscription($id:String!) {
            documentChanged(id:$id) {
                delta, instance
            }
        }`;         
    documentChangedSubscription = subscribe(DOCUMENTCHANGED_SUBSCRIPTION, {
        variables: {            
            id: id
    }});
    
    documentChangedUnsubscriber = documentChangedSubscription.subscribe(        
        result => {            
            if (result?.data?.documentChanged) {
                callback(result.data.documentChanged);
            }
        });
}

async function changeDocument(id, instance, version, delta) {

    var result = await changeDocumentMutation({
        variables: {                
            change: {id: id, instance: instance, version: version, delta: delta}            
    }})    

    if (result.data == null) {
        console.error("Failed to send document changed")
    }
}


export {init as initSessions, createSession, deleteSession, subscribeForSessionChanges, changeDocument, subscribeForDocumentChanges};