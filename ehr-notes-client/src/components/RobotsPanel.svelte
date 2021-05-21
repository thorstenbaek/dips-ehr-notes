<script>
    import RobotPanel from "./RobotPanel.svelte";

    export let robots;
</script>

{#if robots}
    {#each Object.entries(robots) as [name, robot]}
        <RobotPanel {name} {robot}/>
    {/each}
{/if}