<script>
    import { createEventDispatcher } from 'svelte';
    import {user} from "../SmartOnFhirStore";
    import {session, instance, createSession, deleteSession, subscribeForSessionChanges} from "../SessionsStore";

    const dispatch = createEventDispatcher();

    export let id;
    export let editor;
    let users;

    $: {
        if ($user && id && editor) {
            createSession(id, JSON.stringify(editor.getDelta()));
            subscribeForSessionChanges(id);
        }
    }

    $: users = $session?.users;

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
{#if users && users.length > 1}
    <ul>
        {#each users as user}
            {#if user.instance != $instance}
                <li title="TODO - look up user from FHIR API..." style="background-color:{user.color}">U</li>
            {/if}
        {/each}
    </ul>
{/if}

<slot/>

<style>
    ul {
        text-align: right;
    }
    li {
        display: inline;
        background-color: #4CAF50; /* Green */
        color: white;
        border-radius: 50%;
        border: none;
        padding: 5px 10px 5px 10px;
        text-align: center;
        text-decoration: none;
        font-size: 16px;
        font-weight: bold;
        margin: 5px 2px;
        user-select: none;
    }
</style>