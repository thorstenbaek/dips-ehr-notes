<script>
    import { createEventDispatcher } from 'svelte';
    import {user} from "../SmartOnFhirStore";
    import {session, createSession, deleteSession, subscribeForSessionChanges} from "../SessionsStore";
    
    const dispatch = createEventDispatcher();
    
    export let id;
    export let editor;
    export let version;

    $: {
        if ($user && id && editor) {    
            createSession(id, JSON.stringify(editor.getDelta()));
            subscribeForSessionChanges(id);      
        }
    }        

    function pagehide(_) {
        if ($session != null)
        {
            dispatch("onSessionClosed");
            deleteSession();            
        }
        else
        {
            console.log("Session is null");
        }
    }  

</script>

<svelte:window on:pagehide={pagehide} />

{#if $session}
<div class="session {$session?.users.length > 1 ? 'active' : ''}">
    <div class="status">Version: {version} Document: <b>{$session.id}</b></div>
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