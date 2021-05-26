<script>
    import { Canvas, Layer } from "svelte-canvas";
    import anatomy from "./anatomy.json";

    export let entities;
    let groups;

    $: {
        let filteredEntities = [];
        entities.map(e => {
            anatomy.values.map(a => {
                if (e.word.toLowerCase() === a.text.toLowerCase()) {
                    filteredEntities.push(a.group);    
                }
            });
        });        

        groups = anatomy.groups.filter(g => filteredEntities.includes(g.name));
        
    }

    $: render = ({context}) => {
        context.globalAlpha = 0.9;
        context.fillStyle = "#df6f35";                                               
        
        groups.map(g => {
            context.beginPath();
            context.arc(g.x, g.y, 4, 0, 2*Math.PI);
            context.fill();     
        });        
    };        
        
</script>

<Layer {render}/>