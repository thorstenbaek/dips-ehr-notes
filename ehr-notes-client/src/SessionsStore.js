
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
    mutation($session: SessionInput!){
        createSession(session: $session) {
            id
            delta,
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

async function createSession(id, delta) {    
    var result = await createSessionMutation({
        variables: {                
            session: {
                id: id,
                delta: delta,
                user: get(user).id
            }}});
    session.set(result.data.createSession);        
}

function deleteSession() {      
    const url = `${urlBuilder.getBaseUrl()}/api/deleteSession?id=${get(session).id}&user=${get(user).id}`;            
    fetch(url, {
        method: "post",
        mode: "cors",                        
        keepalive: true // needed when fetch is called from pagehide
    });
    if (sessionChangedUnsubscriber != null)
        sessionChangedUnsubscriber();
    if (documentChangedUnsubscriber != null)
        documentChangedUnsubscriber();
    session.set(null);
}

function subscribeForSessionChanges(document) {
    console.log("Subscribing for changes to session for " + document.id);
    
    const SESSIONCHANGED_SUBSCRIPTION = gql`
    subscription($id:String!) {
        sessionChanged(id:$id) {
            id 
            users
        }
    }`;       
    
    sessionChangedSubscription = subscribe(SESSIONCHANGED_SUBSCRIPTION, {
        variables: {
            id: document.id
    }});

    sessionChangedUnsubscriber = sessionChangedSubscription.subscribe(        
        result => {              
            if (result.data)
            {
                const newSession = {
                    id: result.data.sessionChanged.id,                    
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