<script>
    import { Delta, Editor } from "typewriter-editor";
    import { v4 } from "uuid";
    import marked from 'marked'
    //Consider changing to this package supporting two way md-conversion: https://github.com/showdownjs/showdown
    //import Root from "typewriter-editor/lib/Root.svelte";    
    import asRoot from "typewriter-editor/lib/asRoot";
    import Toolbar from "./Toolbar.svelte";            
    import Sidebar from "./Sidebar.svelte";
    import Session from "./Session.svelte";    
    import {changeDocument, subscribeForDocumentChanges} from "../SessionsStore";

    export let document = null;
    
    let instance = v4();
    let sidebar = false;            
    let selection = [];
    let isUpdating = false;

    let editor = new Editor();

    editor.on("change", event => {            
        if (!isUpdating && event != null && event.change != null) {                        
            const change = {
                ops: event.change.delta.ops,
                //selection: event.change.selection
            }

            changeDocument(document.id, instance, JSON.stringify(change));
        }
    })

    function onChanged(data){
        isUpdating = true;
        
        if (data.instance != instance)
        {            
            var change = JSON.parse(data.content);
            if (change.ops.length > 0)
            {
                var delta = new Delta(change.ops);
                editor.update(delta);                        
            }
            
            //editor.select(change.selection);
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

    function addDelta()
    {
        if (selection.length > 0)
        {
            var delta = new Delta([
                { retain: selection[0] },
                { insert: '\nWhat do you get when you have a cat that eats lemons?\nA sour puss\n' } ]);
            
            editor.update(delta);
            log(delta);
        }
    }
    
</script>
    {#if document}
        <Session document={document}>
            <Toolbar editor={editor} 
                    sidebar={sidebar} 
                on:toggleSidebar={toggleSidebar} />
                <div class="scroll">
                    <div class="container">
                        <div use:asRoot={editor} class="editor" spellcheck="false" />
                        <Sidebar active={sidebar} mode="narrow">
                            <button on:click={addDelta}>Add Delta</button>
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
</style>