<script>
    import { createEventDispatcher } from 'svelte';    
    const dispatch = createEventDispatcher();        

    export let document
</script>


<li on:click={() => dispatch("openDocument", document)}>
    <span class="{document.session != null ? 'session':'hidden'}">●</span>    
    {document.title} {document.session}
</li>

<style>
    .session {
        display: inline;
        color: limegreen;
    }

    .hidden {
        visibility: hidden;
    }

    li {        
        margin: 0;
        padding: 0;        
        display: block;
    }
    
    li:hover {
        color: white;
        background: slategrey;        
        margin: 0;
        padding: 0;        
    }
</style>