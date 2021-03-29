<script>
    import {Layer} from "svelte-canvas";

    let width;
    let height;

    export let rects;        
       
//    $: render = $t && (({ context, width, height}) => {
    $: render = ({ context, width, height}) => {
        //context.clearRect(0, 0, width, height);
        if (rects) {
            rects.map(rect => {
                if (rect != null) 
                {
                    context.fillStyle = 'rgba(255, 165, 0, 0.1)';                    
                    context.strokeStyle = 'rgb(255, 165, 0)';                    
                    context.fillRect(rect.x, rect.y, rect.width, rect.height);                                    

                    context.beginPath();
                    context.moveTo(rect.x, rect.y + rect.height);
                    context.lineTo(rect.x + rect.width, rect.y + rect.height);
                    context.stroke();
                }
            });        
        }
    }
        /*if (context) {
        context.clearRect(0, 0, width, height);
        if (rects) {
                rects.map(rect => {
                    if (rect != null) 
                    {
                        context.fillStyle = 'rgba(255, 165, 0, 0.1)';                    
                        context.strokeStyle = 'rgb(255, 165, 0)';                    
                        context.fillRect(rect.x, rect.y, rect.width, rect.height);                                    

                        context.beginPath();
                        context.moveTo(rect.x, rect.y + rect.height);
                        context.lineTo(rect.x + rect.width, rect.y + rect.height);
                        context.stroke();
                    }
                });        
            }
        }*/
    

</script>
<!-- <Overlay width={editorWidth} height={editorHeight}/> bind:clientHeight="{editorHeight}" bind:clientWidth="{editorWidth}"-->
<!-- <canvas class="canvas" bind:this={canvas} width="{width}" height="{height}" /> -->
<Layer {render} />

<style>

</style>