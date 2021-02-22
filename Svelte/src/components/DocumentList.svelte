<script>
    import { onMount } from "svelte";
    import { query, subscribe } from "svelte-apollo";
    import DocumentItem from "./DocumentItem.svelte";
    import gql from 'graphql-tag';
    import { createEventDispatcher } from 'svelte';    

    const dispatch = createEventDispatcher();        
    
    const DOCUMENTS_QUERY = gql`
            {
                documents {
                    id
                    date
                    title
                    author
                    markdown
                    session {
                        id
                        users
                    }
                }
            }`;                        
    var documents = query(DOCUMENTS_QUERY);    

    onMount(() => {
        documents.refetch();
    });
</script>

<div class="documentList">
    {#if $documents.loading}
        <p>Loading documents</p>
    {:else if $documents.error}
        <p>{$documents.error}</p>
    {:else if $documents.data}
        <ul>                
            {#each $documents.data.documents as document}                
                <DocumentItem document={document} on:openDocument={() => dispatch("openDocument", document)}/>
            {/each}
        </ul>
    {:else}
        <p>No documents found</p>
    {/if}
</div>

<style>
    .documentList {
        margin: 10px;
        padding: 10px;
        background: white;
        box-shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px rgba(0, 0, 0, .1);
    }

    .documentList ul {
        margin: 10px 10px 10px 10px;
        padding: 0;
    }    
</style>