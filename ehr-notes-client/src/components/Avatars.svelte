<script>
    import {Layer} from "svelte-canvas";

    export let avatars;

        
    $: render = ({ context, width, height}) => {
        context.fillStyle = 'rgba(255, 165, 0, 0.4)';                    

        if (avatars) {
            var rects = Object.values(avatars);
            console.log(rects);    
            rects.map(r => {       
                context.fillRect(r.x, r.y, r.width, r.height);                
            });
            
        }
    }
</script>

<Layer {render}/>