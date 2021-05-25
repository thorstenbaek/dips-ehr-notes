<script>
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

    function lighten(hex){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.25)';
        } 
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
            <h2 style="background: {lighten(value[0].color)}">{key}</h2>
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
    h2 {
        font-size: 1em;
        margin: 5px 0;
    }
    p {
        padding: 0;
        margin: 0;
    }
</style>



