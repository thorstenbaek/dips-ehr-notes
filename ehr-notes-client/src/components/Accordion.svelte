<script>
    import { slide } from "svelte/transition";
	
    export let items;
    export let title;

    let showContent;
    let entries;
    let count;
    
    $: {
        entries = Object.entries(items);
        count = entries.length;
    }

    const showCollapse = key => {
        (showContent === key) ? showContent = null : showContent = key;
    }
</script>

<div >        
    {#each entries as [key, value]}   
        {#if value.entities.length > 0}     
        <div class="accordion">
            <div class="header" on:click={showCollapse(key)}>
                {#if title}
                    {title}
                {:else}
                    <span>{key} ({value.entities.length})</span>                    
                {/if}
                {#if showContent}
                    <span class="material-icons button">expand_less</span>
                {:else}
                    <span class="material-icons button">expand_more</span>
                {/if}
            </div>
            {#if showContent===key}
            <div class="content" transition:slide>
                <slot {key} {value} />
            </div>    
            {/if}
        </div>
        {/if}
    {/each}
</div>

<style>
    .accordion {
      margin: 4px;
      background-color: white;
    }

    .header {
      padding: 4px;
      transition: 200ms ease-in-out;
      
    }

    .content {
        padding: 4px;
        border-top: var(--gray) solid 1px;        
    }

    .button {
        position: absolute;
        right: 0;
        vertical-align: text-bottom;
        text-align: right;
        padding: 0 4px 0 0;        
        cursor: pointer;
    }
    
</style>