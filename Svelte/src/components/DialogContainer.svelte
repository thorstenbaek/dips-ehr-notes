<script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    export let showDialog;

    function close()
    {        
        dispatch("close");
    }
</script>

<div>        
    {#if showDialog}
    <div class="overlay" on:click={close}>
        <div class="child">
            <slot/>
        </div>
    </div>    
    {/if}
</div>

<style>
    .overlay {        
        justify-content: center;
        display: flex;
        position:absolute;
        vertical-align: center;
        align-content: center;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5);
        height: 100%;
        width: 100%;
        z-index: 99;
    }

    .child {
        margin: auto auto;
    }

    .open {
        display: flex;
    }
</style>