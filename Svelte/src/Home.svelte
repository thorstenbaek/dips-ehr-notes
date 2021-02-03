<script>  
    import { context } from "./stores.js";      
    import './smart-on-fhir';
    import Patient from "./components/Patient.svelte";    
    import Editor from "./components/Editor.svelte";        

    let error = null;
    
    $: {
        error = $context?.error;
    }
</script>

{#if error != null}
    <p>{error}</p>    
{:else}     
    <!-- <Patient /> -->
    <Editor />    
{/if}