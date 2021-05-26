<script>
    import Accordion from "./Accordion.svelte";
    import RobotPanel from "./RobotPanel.svelte";
    import AnatomyPanel from "./AnatomyPanel.svelte";

    export let robots;
</script>

{#if robots}
    <Accordion items={robots} let:value let:key>
        <RobotPanel name={key} robot={value}/>                
    </Accordion>
    
    <div class="anatomyPanel">
        <AnatomyPanel {robots}/>
    </div>
{/if}

<style>
    .anatomyPanel {
        padding: 5px;
    }
</style>