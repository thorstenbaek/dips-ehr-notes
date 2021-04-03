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
    import {changeDocument, session, subscribeForDocumentChanges} from "../SessionsStore";

    export let document = null;
    
    let instance = v4();
    let sidebar = false;            
    let selection = [];
    let isUpdating = false;
    let height, width;
    let editor = new Editor();        
    let rects;
    let avatars = {};
    let version = 0;

    editor.on("change", event => {            
        if (!isUpdating && event != null && event.change != null) {                        
            // const change = {
            //     delta: event.change.delta,
            //     selection: event.change.selection
            // }

            changeDocument(document.id, instance, version, JSON.stringify(event.change.delta));
        }
    })

    // function updateSelection() {
    //     const change = {
    //         selection: editor.doc.selection
    //     };
    //     changeDocument(document.id, instance, JSON.stringify(change));
    // }
    session.subscribe(value => {
        console.log(value);
        if (value?.version > 0) {
            isUpdating = true;
            try {
                if(value?.document) {
                    editor.setDelta(new Delta(JSON.parse(value.document)));
                }
            } finally {
                isUpdating = false;
            }                               
        }
    })

    function onSessionClosed() {
        // reset selection
        const change = {
            selection: [0, 0]
        };
        changeDocument(document.id, instance, JSON.stringify(change));
    }

    function onSessionCreated(document) {
        
    }

    function onChanged(data){
        isUpdating = true;
        version++;
        console.log("version", version);

        if (data.instance != instance)
        {            
            var change = JSON.parse(data.delta);
            if (change?.ops?.length > 0)
            {
                var delta = new Delta(change.ops);
                editor.update(delta);                        
                updateSelection();
            }

            if (change?.selection) {        
                avatars[data.instance] = change.selection;
            }
        }        
        
        isUpdating = false;
    }

    $:{        
        if (document != null)
        {                    
            editor.setHTML(marked(document.markdown));                            
            subscribeForDocumentChanges(onChanged, instance, document.id);
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
        <Session id={document.id} editor={editor} on:onSessionClosed={onSessionClosed} on:onSessionCreated={onSessionCreated}>
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