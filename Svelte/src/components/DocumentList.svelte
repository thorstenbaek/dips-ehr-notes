<script context="module">
    import { getClient, query } from "svelte-apollo";
        // https://hasura.io/blog/build-and-deploy-svelte-js-3-apps-using-graphql/
        // export async function preload() {
        // return {
        //     documents: await query(getClient(), DOCUMENTS)    
        // }
</script>

<script>

    import DocumentItem from "./DocumentItem.svelte";
    import gql from 'graphql-tag';
    import { createEventDispatcher } from 'svelte';    

    const dispatch = createEventDispatcher();        

    export const DOCUMENTS_QUERY = gql`
    {
        documents
        {
            id
            date
            title
            author
            markdown
            hasSession
        }
    }`;
    
    //export let cache;
    //restore(getClient(), DOCUMENTS, cache.data);
    const documents = query(DOCUMENTS_QUERY);    
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

    <!-- <ul>
        {#each documents as document}
        <li on:click={() => dispatch("openDocument", document)}>
            {document.Title}
        </li>    
        {/each}    
    </ul> -->
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