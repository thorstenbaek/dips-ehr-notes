<script>
    import {Layer} from "svelte-canvas";

    export let editor;
    export let avatars;


        
    $: render = ({ context, width, height}) => {
        

        if (avatars && editor) {
            var selections = Object.values(avatars);
            selections.map(s => {
                var rects = editor.getAllBounds(s);
                for(var i = 0; i < rects.length; i++) {
                    const r = rects[i];
                    if (r.width < 1) {
                        context.fillStyle = 'rgba(255, 165, 0, 1.0)';                    
                        context.fillRect(r.x, r.y, 3, r.height);
                    }
                    else { 
                        context.fillStyle = 'rgba(255, 165, 0, 0.4)';                    
                        context.fillRect(r.x, r.y, r.width, r.height);                  
                    }
                }                
            })
        }
    }
</script>

<Layer {render}/>