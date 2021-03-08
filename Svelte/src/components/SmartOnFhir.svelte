<script>
    import { user, patient, encounter } from '../SmartOnFhirStore.js';
</script>

<ul>    
    <li>
        <img src="images/icon-fhir-720.png" height="24px" alt="FHIR logo"/>
    </li>
    {#if $user != null}
    <li>
    User: 
    {#each $user?.name[0].given as given, i}
        {given + " "}
    {/each}
    {$user?.name[0].family}    
    </li>
    {/if}    
    {#if $patient != null}
    <li>
        Patient: 
        {#each $patient?.name[0].given as given, i}
            {given}
        {/each}
        {$patient?.name[0].family}    
    </li>        
    {/if}
    {#if $encounter != null}
    <li>
        Encounter: 
        {$encounter.id}        
    </li>            
    {/if}
</ul>

<style>
    img {
        padding: 4px;        
    }
    ul {
        margin: 0;
        padding: 0;
    }
    li {
        margin: 1px;
        display: inline-block;
        padding: 0 20px 0 0;
        font-size: 12px;
    }
</style>