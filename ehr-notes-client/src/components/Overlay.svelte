<script>
    import {onMount} from "svelte";
import { React } from "typewriter-editor";

    let canvas;
    let context;
    let width;
    let height;

    export let rects;        
       
    $: {        
        if (context) {
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
        }
    }

    onMount(() => {
        context = canvas.getContext("2d", {});
        console.log(context);
        
    });

    function resize(event) {
        // console.log(event);
        // canvas.width = event.target.innerWidth;
        // canvas.height = event.target.innerHeight;
    }
</script>
<!-- <Overlay width={editorWidth} height={editorHeight}/> bind:clientHeight="{editorHeight}" bind:clientWidth="{editorWidth}"-->
<canvas class="canvas" bind:this={canvas} width="{width}" height="{height}" />
<svelte:window on:resize={resize} bind:innerHeight={height} bind:innerWidth={width}/>

<style>
    .canvas {
        position: absolute;
        left: 0px;
        top: 0px;        
        /*height: calc(100% - 130px);     
        width: calc(100% - 4px);      */
        color: rgba(125, 0, 0, 0.25);
        background: transparent;        
        pointer-events: none;
    }
</style>