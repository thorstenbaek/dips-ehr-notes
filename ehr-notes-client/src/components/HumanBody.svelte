
<script>
import { Canvas, Layer } from "svelte-canvas";

    const humanBodySvg = new Image();
    humanBodySvg.src = "../images/standing-human-body-silhouette-svgrepo-com.svg";
    
    $: render = ({context, width, height}) => {
        context.globalAlpha = 1;        
        context.strokeRect(0, 0, width, height);
        context.globalAlpha = 0.2;        
        context.drawImage(humanBodySvg, -55, 5, 250, 250);
    };        
        
</script>

<Layer {render}/>