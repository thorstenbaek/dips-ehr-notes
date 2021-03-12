<script>
    import { mutation, subscribe } from "svelte-apollo";
    import gql from 'graphql-tag';
    import {user} from "../SmartOnFhirStore";
    import {session, sessionsUrl, sessionsProtocol} from "../SessionsStore";
    
    export let document;

    let sessionChangedUnsubscriber;
    let documentChangedUnsubscriber;

    const CREATESESSION_MUTATION = gql`    
        mutation($document: String!, $user: String!){
            createSession(document: $document, user: $user) {
                id
                document,
                users
            }
        }`;
    const createSession = mutation(CREATESESSION_MUTATION);

    const DELETESESSION_MUTATION = gql`
        mutation($document: String!, $user: String!){
            deleteSession(document: $document, user: $user)
        }`;
    const deleteSession = mutation(DELETESESSION_MUTATION);

    const CHANGEDOCUMENT_MUTATION = gql`
        mutation($document: String!, $change: String!){
            changeDocument(document: $document, change: $change) {
                content
            }
        }`;
    const changeDocument = mutation(CHANGEDOCUMENT_MUTATION);  

    const SESSIONCHANGED_SUBSCRIPTION = gql`
        subscription($document:String!) {
            sessionChanged(document:$document) {
                id 
                document
                users
            }
        }`;       

    // const DOCUMENTCHANGED_SUBSCRIPTION = gql`
    //     subscription($document:String!) {
    //         documentChanged(document:$document) {
    //             content
    //         }
    //     }`;     
    

    $: {
        if ($user && document && $session == null)
        {            
            createSession({
                variables: {                
                    document: document.id,
                    user: $user.id
            }}).then(result => {    
                session.set(result.data.createSession);    
            });
        }

        if ($session != null) {
            console.log("Subscribing for changes to session for " + $session.document);
            sessionChangedUnsubscriber = subscribe(SESSIONCHANGED_SUBSCRIPTION,
            {            
                variables: {
                    document: $session.document },
            })            
            .subscribe(
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
                });
            
            /*console.log("Subscribing to changes to document for " + $session.document);
            documentChangedUnsubscriber = subscribe(DOCUMENTCHANGED_SUBSCRIPTION, 
            {
                variables: {
                    document: $session.document },
            })
            .subscribe(
                result => {
                    if (result.data)
                    {
                        console.log(result.data);
                    }
                }
            );*/                           
        }
    }        

    function pagehide(_) {
        if ($session != null)
        {
            //documentChangedUnsubscriber();
            sessionChangedUnsubscriber();

            const url = `${sessionsProtocol}://${sessionsUrl}/api/deleteSession?document=${$session.document}&user=${$user.id}`;            
            console.log("Delete url " + url);
            
            fetch(url, {
                method: "post",
                mode: "cors",                
                body: mutation,
                keepalive: true
            });
        }
    }  

    function doChangeDocument()
    {
        changeDocument({
            variables: {                
                document: $session.document,
                change: "Dette er en endring fra knappen i Session-panelet"                
        }}).then(result => {    
            
        });    
    }

</script>

<svelte:window on:pagehide={pagehide} />

{#if $session}
<div class="session {$session?.users.length > 1 ? 'active' : ''}">
    <div class="status">Session for document <b>{$session.document}</b> <button on:click={doChangeDocument}>Change</button></div>
    <slot/>
</div>
{:else}
    <slot/>
{/if}
<style>
    .status {
        height:25px;
    }

    .session {
        overflow: hidden;
        height: calc(100% - 25px);
        width: calc(100% - 5px);
        display: table;    
        padding: 3px;                
    }

    .active {
        background: limegreen;        
    }
</style>