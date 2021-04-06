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
    import Avatars from "./Avatars.svelte";
    import {changeDocument, session, instance, subscribeForDocumentChanges, changeSelection, subscribeForSelectionChanges} from "../SessionsStore";  
    import OtClient from "../OtClient";  

    export let document = null;
    
    let sidebar = false;            
    let selection = [];
    let isUpdating = false;
    let height, width;
    let editor = new Editor();        
    let avatars = {};    
    let otClient = null;

    editor.on("change", event => {            
        if (!isUpdating && event != null && event.change != null) {                        
                      
            otClient?.applyFromClient(event.change.delta);            
            changeSelection(document.id, $instance, event.change.selection);
        }
    })    

    function initializeOt(_v) {
        otClient = new OtClient(_v);

        otClient.sendDelta = (_v, delta) => {            
            changeDocument(document.id, $instance, _v, JSON.stringify(delta));
        }

        otClient.applyDelta = (d) => {
            
            isUpdating = true;
            try {
                {                                
                    var delta = new Delta(d);
                    editor.update(delta);       
                    // update selection in other clients
                    changeSelection(document.id, $instance, editor.doc.selection);                  
                }    
            } 
            finally {
                isUpdating = false;
            }            
        }
    }
    
    session.subscribe(value => {
        // Session was changed from outside this        
        if (value?.version > 0) {
            isUpdating = true;
            try {
                if(value?.document) {
                    editor.setDelta(new Delta(JSON.parse(value.document)));                    
                }
                initializeOt(value.version);
            } finally {
                isUpdating = false;
            }                               
        }
        else {
            initializeOt(0);
        }
    })

    function onSessionClosed() {
        // reset selection
        const change = {
            selection: [0, 0]
        };
        changeDocument(document.id, $instance, JSON.stringify(change));
    }    

    function onChanged(data) {
        var delta = JSON.parse(data.delta);
        if (data.instance != $instance) {
            otClient.applyFromServer(delta);                                        
        } else {
            otClient.serverAck();
        }               
    }

    function onSelectionChanged(data) {
        if (data.instance != $instance) {           
            avatars[data.instance] = [data.start, data.end];            
        }
    }

    $:{        
        if (document != null) {                    
            editor.setHTML(marked(document.markdown));                            
            subscribeForDocumentChanges(onChanged, document.id);
            subscribeForSelectionChanges(onSelectionChanged, document.id);
        }
        else {
            editor.setText(null);
        }        
    }

    function toggleSidebar()
    {
        sidebar = !sidebar;
    }   
    
</script>
    <svelte:window bind:innerHeight={height} bind:innerWidth={width}/>
    {#if document}
        <Session id={document.id} editor={editor} on:onSessionClosed={onSessionClosed} >
            <Toolbar editor={editor} 
                    sidebar={sidebar} 
                on:toggleSidebar={toggleSidebar}/>            
                <div class="scroll">
                    <div class="container">
                        <div use:asRoot={editor} class="editor" spellcheck="false" />
                        <div class="canvas">
                            <Canvas width={width} height={height}>
                                <Avatars {editor} {avatars} users={$session?.users}/> 
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