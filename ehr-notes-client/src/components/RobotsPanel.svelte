<script>
    import Accordion from "./Accordion.svelte";
    import RobotPanel from "./RobotPanel.svelte";

    export let robots;
</script>

{#if robots}
    <Accordion items={robots} let:value let:key>                
        <RobotPanel name={key} robot={value}/>
    </Accordion>
{/if}