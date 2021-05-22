<script>
    export let name;
    export let robot;
    let collapsed = false;
    let hasEntities = false;    
    let groups;

    function groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    function toggleCollapsed() {
        collapsed = !collapsed;
    }

    $: {        
        hasEntities = robot?.entities?.length > 0;    
        if (robot?.entities) {
          groups = groupBy(robot?.entities, e => e.label);
        }
    }
</script>


{#if hasEntities}
<div class="entities">
        {#each [...groups] as [key, value]}
            <h2>{key}</h2>
            {#each value as v}
                <p>{v.word}</p>
            {/each}
        {/each}
    
</div>
{/if}
<style>
    * {
        font-size: 0.9em;
    }
    h1 {
        font-size: 1.2em;
        padding: 0;
        margin: 0;
    }
    h2 {
        font-size: 1em;
        margin: 5px 0;
    }
    p {
        padding: 0;
        margin: 0;
    }
</style>



