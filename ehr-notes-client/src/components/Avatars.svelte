<script>
    import {Layer} from "svelte-canvas";

    export let editorTop;
    export let editor;
    export let avatars;
    export let users;
        
    $: render = ({ context, width, height}) => {

        if (avatars && editor && users) {
            var keys = Object.keys(avatars);
            keys.map(k => {
                var s = avatars[k];            
                var user = users.filter(u => u.instance == k);
                var color = user.length == 1 ? user[0].color : "transparent";
                
                var rects = editor.getAllBounds(s);                
                for(var i = 0; i < rects.length; i++) {
                    const r = rects[i];

                    context.fillStyle = color;                           
                    context.globalAlpha = 1;                 
                    context.fillRect(r.x, r.y - editorTop, 3, r.height);
                    if (r.width >= 1) {
                        context.fillStyle = color;                    
                        context.globalAlpha = 0.45;                 
                        context.fillRect(r.x, r.y - editorTop, r.width, r.height);                  
                    }
                }                
            })
        }
    }
</script>

<Layer {render}/>