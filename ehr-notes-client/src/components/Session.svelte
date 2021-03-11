<script>
    import { mutation, subscribe } from "svelte-apollo";
    import gql from 'graphql-tag';
    import {user} from "../SmartOnFhirStore";
    import {session, sessionsUrl, sessionsProtocol} from "../SessionsStore";
    
    export let document;

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

    const SESSIONCHANGED_SUBSCRIPTION = gql`
        subscription($document:String!) {
            sessionChanged(document:$document) {
                id 
                document
                users
            }
        }`;       

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
            subscribe(SESSIONCHANGED_SUBSCRIPTION,
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
                }
            );
        }
    }        

    function pagehide(_) {
        if ($session != null)
        {
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

</script>

<svelte:window on:pagehide={pagehide} />

{#if $session}
<div class="session {$session?.users.length > 1 ? 'active' : ''}">
    <div class="status">Session for document <b>{$session.document}</b></div>
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