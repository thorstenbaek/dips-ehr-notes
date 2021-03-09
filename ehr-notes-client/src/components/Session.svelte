<script context="module">
    import { mutation, subscribe } from "svelte-apollo";
    import gql from 'graphql-tag';
    import { user } from "../stores";        
</script>
<script>
    import { onDestroy } from 'svelte';

    export let session = null;
    export let documentId = null;

    const SESSIONCHANGED_SUBSCRIPTION = gql`
        subscription($documentId:ID!) {
            sessionChanged(documentId:$documentId) {
                id 
                documentId
                users
            }
        }`;         
    
    const CREATESESSION_MUTATION = gql`    
        mutation($documentId: ID!, $user: String!){
            createSession(documentId: $documentId, user: $user) {
                id
                documentId
            }
        }`;
    const createSession = mutation(CREATESESSION_MUTATION);

    const DELETESESSION_MUTATION = gql`
        mutation($documentId: ID!, $user: String!){
            deleteSession(documentId: $documentId, user: $user)
        }
    `;
    const deleteSession = mutation(DELETESESSION_MUTATION);
    
    $: {                        
        if (session == null)
        {
            createSession({
                variables: {                
                    documentId: documentId,
                    user: $user
            }}).then(result => {    
                console.log(result);        
                session = result.data;
            });
        }

        if (session != null)
        {
            console.log("has session");
            /*console.log("create session " + session  + " " + $user);
            
            
            /*subscribe(SESSIONCHANGED_SUBSCRIPTION,
            {            
                variables: {
                    documentId: session?.documentId}
            })
            .subscribe(
                result => {
                    if (result.data)
                    {
                        session = result.data;
                    }
                }
            );*/
        }
    }
   
    onDestroy(() => {
        if (session != null)
        {
            deleteSession({
                variables: {
                    documentId: session?.documentId,
                    user: $user
            }});            
        }
    });
    
    //Also delete session when window / frame is closed    

</script>
    <div class="session {session?.users.length > 1 ? 'online':''}"> 
        {#if session != null && session.length > 1}
            <ul>            
                {#each session?.users as user}
                    <li>{user}</li>
                {/each}
            </ul>
        {/if}
        <slot/>
    </div>
<style>
    div {
        overflow: hidden;
        top: 2px;        
        border: none;
        height: calc(100% - 65px);        
    }

    .online {
        border: limegreen 2px solid;    
    }

    p {    
        display: block;
        margin: 0;
        padding-left: 5px;        
        font-size: 12px;        
    }

    .online p {
        display: block;
        background: limegreen;       
    }
</style>