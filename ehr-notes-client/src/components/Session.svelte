<script>
    import { mutation, subscribe } from "svelte-apollo";
    import gql from 'graphql-tag';
    import {user} from "../SmartOnFhirStore";
    import {sessionsUrl} from "../SessionsStore";
import { select_option } from "svelte/internal";
    
    export let document;
    let session = null;

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

    $: {
        if ($user && document && session == null)
        {            
            createSession({
                variables: {                
                    document: document.id,
                    user: $user.id
            }}).then(result => {    
                console.log(result);        
                session = result.data.createSession;
            });
        }
    }    

    function pagehide(_) {
        if (session != null)
        {
            // Calling any thing else than sendBeacon from pagehide/unload is immpossible. Need to post to Restful endpoint here
            navigator.sendBeacon(`http://${sessionsUrl}/api/deleteSession?document=${session.document}&user=${$user.id}`);        
        }
    }  

</script>

<svelte:window on:pagehide={pagehide} />

<div class="session {session?.users.length > 1 ? 'active' : ''}">
    <div class="status">Session for document <b>{document.title}</b></div>
    <slot/>
</div>

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