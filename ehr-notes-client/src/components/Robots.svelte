<script>
    import {Layer} from "svelte-canvas";

    export let editorTop;
    export let editor;
    export let robots;
        
    $: render = ({ context, width, height}) => {
        context.globalAlpha = 0.25;                 

        if (editor && robots) {
            console.log(robots);
            for(const [key, value] of Object.entries(robots)) {            
                console.log(value);
                value.entities.map(entity => {
                    var r = editor.getBounds([entity.index, entity.index + entity.word.length]);      
                    context.fillStyle = entity.color;                                                   
                    context.fillRect(r.x, r.y - editorTop, r.width, r.height);           
                    
                });
            };
        }
    }
</script>
<Layer {render}/>