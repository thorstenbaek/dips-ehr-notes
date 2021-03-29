<script>
    import { Delta, Editor } from "typewriter-editor";
    import { Canvas } from "svelte-canvas";
    import { v4 } from "uuid";
    import marked from 'marked'
    //Consider changing to this package supporting two way md-conversion: https://github.com/showdownjs/showdown
    //import Root from "typewriter-editor/lib/Root.svelte";    
    import asRoot from "typewriter-editor/lib/asRoot";
    import Toolbar from "./Toolbar.svelte";            
    import Sidebar from "./Sidebar.svelte";
    import Session from "./Session.svelte";    
    import Overlay from "./Overlay.svelte";
    import Avatars from "./Avatars.svelte";
    import {changeDocument, subscribeForDocumentChanges} from "../SessionsStore";

    export let document = null;
    
    let instance = v4();
    let sidebar = true;            
    let selection = [];
    let isUpdating = false;
    let height, width;
    let editor = new Editor();        
    let rects;
    let avatars = {};

    editor.on("change", event => {            
        if (!isUpdating && event != null && event.change != null) {                        
            const change = {
                ops: event.change.delta.ops,
                selection: event.change.selection
            }

            changeDocument(document.id, instance, JSON.stringify(change));
        }
    })

    function updateSelection() {
        const change = {
            selection: editor.doc.selection
        };
        changeDocument(document.id, instance, JSON.stringify(change));
    }

    function onSessionClosed() {
        // reset selection
        const change = {
            selection: [0, 0]
        };
        changeDocument(document.id, instance, JSON.stringify(change));
    }

    function onChanged(data){
        isUpdating = true;
        
        if (data.instance != instance)
        {            
            var change = JSON.parse(data.content);
            if (change.ops?.length > 0)
            {
                var delta = new Delta(change.ops);
                editor.update(delta);                        
                updateSelection();
            }

            if (change.selection) {        
                avatars[data.instance] = change.selection;
            }
        }        
        
        isUpdating = false;
    }

    $:{        
        if (document != null)
        {                    
            editor.setHTML(marked(document.markdown));                            
            subscribeForDocumentChanges(onChanged, instance, document);
        }
        else
        {
            editor.setText(null);
        }        
    }

    function toggleSidebar()
    {
        sidebar = !sidebar;
    }   

    function drawRect()
    {
        var range = editor.doc.selection;
        if (range)
        {
            var tempRects = []; 
            var rectsList = editor.getAllBounds(range);                
            for(var i = 0; i < rectsList.length; i++)
            {
                tempRects.push(rectsList[i]);
            }

            rects = [...tempRects];
        }
    }
    
</script>
    <svelte:window bind:innerHeight={height} bind:innerWidth={width}/>
    {#if document}
        <Session document={document} on:onSessionClosed={onSessionClosed}>
            <Toolbar editor={editor} 
                    sidebar={sidebar} 
                on:toggleSidebar={toggleSidebar} 
                on:createRange={drawRect}/>
                <div class="scroll">
                    <div class="container">
                        <div use:asRoot={editor} class="editor" spellcheck="false" />
                        <div class="canvas">
                            <Canvas width={width} height={height}>
                                <Avatars {editor} {avatars} /> 
                                <Overlay {rects} />
                            </Canvas>                        
                        </div>
                        <Sidebar active={sidebar} mode="narrow">
                        </Sidebar>
                    </div>
                </div> 
                <div class="statusBar">
                    {selection} 
                </div>                    
        </Session>
    {/if}
<style> 
    .statusBar {
        height: 25px;
        background: #ededed;
    }

    .scroll {    
        overflow: auto;        
        height: calc(100% - 98px);
    }

    .container {    
        overflow: hidden;
        height: 100%;
        width: 100%;
        display: table;    
    }    

    .editor {
        padding: 25px 12px;
        border: none;
        height: calc(100% - 50px);     
        background: white;            
    }    

    .editor:active {
        border: none;
    }
  
    .editor:focus {
        border: none;
    }   
    
    .canvas {
        position: absolute;
        left: 0px;
        top: 0px;                
        color: rgba(125, 0, 0, 0.25);
        background: transparent;        
        pointer-events: none;
    } 
</style>