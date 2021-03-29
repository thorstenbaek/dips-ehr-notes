<script>
    import { createEventDispatcher } from 'svelte';
    import {user} from "../SmartOnFhirStore";
    import {session, createSession, deleteSession, subscribeForSessionChanges} from "../SessionsStore";
    
    const dispatch = createEventDispatcher();
    
    export let document;

    $: {
        if ($user && document) {            
            createSession(document);
            subscribeForSessionChanges(document);    
        }
    }        

    function pagehide(_) {
        if ($session != null)
        {
            dispatch("onSessionClosed");
            deleteSession();            
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