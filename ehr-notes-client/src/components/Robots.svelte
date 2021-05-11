<script>

    import {Layer} from "svelte-canvas";

    export let editor;
    export let entities;
        
    $: render = ({ context, width, height}) => {
        
        

        if (editor && entities?.length > 0) {
            entities.map(entity => {
                var r = editor.getBounds([entity.index, entity.index + entity.word.length]);
                context.fillStyle = "#ff0000";                           
                context.globalAlpha = 0.5;                 
                //console.log("rect", r);    
                context.fillRect(r.x, r.y, r.width, r.height);           
            });
            
            /*var rects = editor.getAllBounds([0, 9]);
            console.log("rects", rects);
            for(var i = 0; i < rects.length; i++) {
                    const r = rects[i];

                    context.fillStyle = "#ff0000";                           
                    context.globalAlpha = 0.5;                 
                    context.fillRect(r.x, r.y, r.width, r.height);                                      
                }*/
        }
    }
</script>

<Layer {render}/>