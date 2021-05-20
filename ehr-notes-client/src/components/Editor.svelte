<script>
    import { Delta, Editor } from "typewriter-editor";
    import { Canvas } from "svelte-canvas";
    import marked from 'marked'
    //Consider changing to this package supporting two way md-conversion: https://github.com/showdownjs/showdown
    //import Root from "typewriter-editor/lib/Root.svelte";    
    import asRoot from "typewriter-editor/lib/asRoot";
    import Toolbar from "./Toolbar.svelte";            
    import Sidebar from "./Sidebar.svelte";
    import Session from "./Session.svelte";    
    import Avatars from "./Avatars.svelte";
    import Robots from "./Robots.svelte";
    import Background from "./Background.svelte";
    import {changeDocument, session, instance, subscribeForDocumentChanges, changeSelection, subscribeForSelectionChanges} from "../SessionsStore";  
    import OtClient from "../OtClient";  
    import EntitiesClient from "../EntitiesClient";

    export let document = null;
    
    let sidebar = false;            
    let isUpdating = false;
    let editor = new Editor();        
    let avatars = {};    
    let otClient = null;
    let windowHeight, windowWidth;
    let canvasElement;    
    let overlayHeight;
    let overlayWidth;
    let contentElement = null;
    let scrollTop;
    let editorTop;
    let contentWidth, contentHeight;
    let robots = {
        "Regexp robot": { entities: []},
        "Starts with s robot": {entities: []}
    };

    $: contentScrollWidth = windowWidth - contentWidth;
    $: canvasWidth = overlayWidth > contentWidth ? overlayWidth : contentWidth;
    $: canvasHeight = overlayHeight > contentHeight ? overlayHeight : contentHeight;

    $: if(!scrollTop && contentElement != null) {
        scrollTop = 0;
        contentElement.addEventListener('scroll', ({ target }) => (scrollTop = target.scrollTop));                    
    }

    $: {
        if (scrollTop >= 0) {
            canvasElement?.redraw();            
        }        
    }

    const entitiesClient = new EntitiesClient(this);

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
        entitiesClient.unsubscribe();
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

    function onEntitiesChanged(data) {        
        if (data) {
            robots[data.name] = {
                entities: data.entities,
                color: data.color }
        }        
    }

    $:{        
        if (document != null) {                    
            editor.setHTML(marked(document.markdown));                            
            subscribeForDocumentChanges(onChanged, document.id);
            subscribeForSelectionChanges(onSelectionChanged, document.id);
            entitiesClient.subscribe(document.id, onEntitiesChanged);                        
        }
        else {
            editor.setText(null);
        }        
    }

    function toggleSidebar()
    {
        sidebar = !sidebar;
        canvasElement?.redraw();
    }   
    
</script>      
    <svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth}/>
    {#if document}        
        <div class="header" bind:clientHeight={editorTop}>           
            <Session id={document.id} editor={editor} on:onSessionClosed={onSessionClosed}/>    
            <Toolbar editor={editor} 
                    sidebar={sidebar} 
                on:toggleSidebar={toggleSidebar}/>            
        </div>
        <div class="scroll" bind:this={contentElement} bind:clientWidth={contentWidth} bind:clientHeight={contentHeight} style="--editor-top: {editorTop}px">
            <div class="content" >
                <div class="editor" use:asRoot={editor} spellcheck="false"/>
                {#if sidebar}
                    <div class="sidebar"/>
                {/if}
            </div>
        </div>
        <div class="overlay" bind:clientHeight={overlayHeight} bind:clientWidth="{overlayWidth}" style="--editor-top: {editorTop}px; --content-right: {contentScrollWidth}px">
            <Canvas width={canvasWidth} height={canvasHeight} bind:this={canvasElement} >                
                <!-- <Background/> -->
                <Avatars {editorTop} {editor} {avatars} users={$session?.users}/> 
                <Robots {editorTop} {editor} {robots}/>
            </Canvas>
        </div>     
    {/if}
<style>     

    .header {
        position: fixed;
		top: 0;
		left: 0;
		right: 0;		
    }

    .scroll {
        position: fixed;
        top: var(--editor-top);
		bottom: 0;
		left: 0;
		right: 0;
        overflow: auto;
    }

    .content {            
        display: table;		
    }
    
    .editor {
        display: table-cell;
        padding: 25px 12px;
        border: none;
        background: white;
    }

    .editor:active {
        border: none;
    }
  
    .editor:focus {
        border: none;
    } 

    .sidebar {
        display: table-cell;
        width: 200px;                
        background: lightgray;
    }  
    
    .overlay {
        position: absolute;
        top: var(--editor-top);
        left: 0;
        right: var(--content-right);
        bottom: 0;
        background: transparent;        
        pointer-events: none;
        overflow: none;
    } 
</style>