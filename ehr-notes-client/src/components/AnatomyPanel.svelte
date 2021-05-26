<script>
    import { Canvas, Layer } from "svelte-canvas";
    import HumanBody from "./HumanBody.svelte";  
    import AnatomyMap from "./AnatomyMap.svelte";  
    
    export let robots;
    let entities;
    
    $: {

        const askRobot = robots["DIPS Ask"];
        if (askRobot) {
            entities = askRobot?.entities.filter(e => e.label === "ANATOMY");            
        }        
    }
    

</script>   
{#if entities?.length > 0}

<div class="panel">
    <Canvas width="110" height="230">
        <HumanBody />
        <AnatomyMap {entities}/>
    </Canvas>
</div>
{/if}
<style>
    .panel {
        background: white;
        margin: 0 55px 0 55px;
    }
</style>