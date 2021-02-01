<script>  
    import { context } from "./stores.js";      
    import './smart-on-fhir';
    import Patient from "./components/Patient.svelte";    

    let error = null;

    $: {
        error = $context?.error;
    }
</script>

{#if error != null}
    <p>{error}</p>    
{:else}
    <Patient/>
{/if}