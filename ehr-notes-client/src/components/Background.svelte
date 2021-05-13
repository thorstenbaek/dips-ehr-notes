<script>
    import {Layer} from "svelte-canvas";

    $: render = ({ context, width, height}) => {

        context.globalAlpha = 0.25;                 
        context.fillStyle = "#772200";                           
        context.fillRect(0, 0, width, height);
    }

</script>
<Layer {render}/>