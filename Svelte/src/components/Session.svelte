<script>
    import { onDestroy } from 'svelte';

    export let document = null;

    onDestroy(() => {
        console.log("Destroy session");
    });
</script>

{#if document}
    <div class="session {document.hasSession ? 'online':''}"> 
        <p>{document.hasSession}</p>
        <slot/>
    </div>
{/if}

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
        display: none;
        margin: 0;
        padding-left: 5px;        
        font-size: 12px;        
    }

    .online p {
        display: block;
        background: limegreen;       
    }
</style>