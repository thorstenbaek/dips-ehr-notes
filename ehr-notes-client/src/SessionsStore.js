
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { WebSocketLink } from "@apollo/client/link/ws";
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { setClient, mutation, subscribe } from "svelte-apollo";
import gql from 'graphql-tag';
import { get, writable, readable } from "svelte/store";
import { v4 } from "uuid";
import { user } from "./SmartOnFhirStore";
import { settings } from "./stores";
import UrlBuilder from "./UrlBuilder";

export let session = writable(null);
export let instance = writable(v4());

let urlBuilder;
let createSessionMutation;
let sessionChangedSubscription;
let sessionChangedUnsubscriber;

let changeDocumentMutation;
let documentChangedSubscription;
let documentChangedUnsubscriber;

let changeSelectionMutation;
let selectionChangedSubscription;
let selectionChangedUnsubscriber;
        
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
    mutation($id: String!, $document: String!, $user: UserInput!){
        createSession(id: $id, document: $document, user: $user) {
            id
            version
            document
            identifier
            users {
                id
                instance
                color        
            }
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
    
    const CHANGESELECTION_MUTATION = gql`
        mutation($selection: SelectionInput!){
            changeSelection(selection: $selection) {
                start
                end
            }
        }`;
    changeSelectionMutation = mutation(CHANGESELECTION_MUTATION);
};

function getUniqueUserId()
{
    return `${get(user).id}:${get(instance)}`;
}

async function createSession(id, document) {            
    var result = await createSessionMutation({
        variables: {       
            id: id,         
            document: document,
            user: {                
                id: getUniqueUserId(), 
                instance: get(instance),
                color: "#4CAF50" }
    }})
    
    session.set(result.data.createSession);        
}

function deleteSession() {      
    const url = `${urlBuilder.getBaseUrl()}/api/deleteSession?id=${get(session).id}&user=${getUniqueUserId()}`;            
    fetch(url, {
        method: "post",
        mode: "cors",                        
        keepalive: true // needed when fetch is called from unload or pagehide
    });
    session.set(null);    
    
    if (sessionChangedUnsubscriber != null)
        sessionChangedUnsubscriber();
    if (documentChangedUnsubscriber != null)
        documentChangedUnsubscriber();
}

function subscribeForSessionChanges(id) {
    const SESSIONCHANGED_SUBSCRIPTION = gql`
    subscription($id:String!) {
        sessionChanged(id:$id) {
            id, version, users { id, instance, color }
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

function subscribeForSelectionChanges(callback, id) {
    console.log("Subscribing for changes to selection " + id);

    const SELECTIONCHANGED_SUBSCRIPTION = gql`
        subscription($id:String!) {
            selectionChanged(id:$id) {
                instance, start, end
            }
        }`;         
    selectionChangedSubscription = subscribe(SELECTIONCHANGED_SUBSCRIPTION, {
        variables: {            
            id: id
    }});
    
    selectionChangedUnsubscriber = selectionChangedSubscription.subscribe(        
        result => {  
            if (result?.data?.selectionChanged) {
                callback(result.data.selectionChanged);
            }
        });
}

async function changeDocument(id, instance, version, delta) {
    var result = await changeDocumentMutation({
        variables: {                
            change: {id: id, instance: instance, version: version, delta: delta}            
    }})    

    if (!result.data) {
        console.error("Failed to send document change")
    }
}

async function changeSelection(id, instance, selection) {
    if (selection)
    {
        var result = await changeSelectionMutation({
            variables: {
                selection: {id: id, instance: instance, start: selection[0], end: selection[1]}
        }})

        if (!result.data) {
            console.error("Failed to send selection change");
        }
    }
}


export {init as initSessions, createSession, deleteSession, subscribeForSessionChanges, changeDocument, subscribeForDocumentChanges, changeSelection, subscribeForSelectionChanges};