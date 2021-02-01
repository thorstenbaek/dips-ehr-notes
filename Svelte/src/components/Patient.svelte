<script>    
    import { context } from "../stores.js";    

    let patient = null;

    $: {
        $context?.client?.patient.read()
            .then(p => patient = p);
    }

</script>

<p>
    {#if patient != null}
        {#each patient?.name[0].given as given, i}
            {given}
        {/each}
        {patient?.name[0].family}    
    {/if}    
</p>
