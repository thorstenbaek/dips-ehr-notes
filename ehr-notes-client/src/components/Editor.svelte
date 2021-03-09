<script>
    import { Editor } from "typewriter-editor";
    import marked from 'marked'
    //Consider changing to this package supporting two way md-conversion: https://github.com/showdownjs/showdown
    //import Root from "typewriter-editor/lib/Root.svelte";    
    import asRoot from "typewriter-editor/lib/asRoot";
    import Toolbar from "./Toolbar.svelte";            
    import Sidebar from "./Sidebar.svelte";
    // import Session from "./Session.svelte";    

    export let markdown = null;
    let sidebar = false;            
    let session = null;

    let editor = new Editor();
    editor.on("change", delta => {        
        if (delta != null && delta.change != null) {
            console.log(delta?.change);
        }
    })

    $:{        
        if (markdown != null)
        {                    
            editor.setHTML(marked(markdown));                            
            //session = document.session;
        }
        else
        {
            editor.setText(null);
            //session = null;
        }
    }

    function toggleSidebar()
    {
        sidebar = !sidebar;
    }   
    
</script>
    <Toolbar editor={editor} 
            sidebar={sidebar} 
        on:toggleSidebar={toggleSidebar} />
        <div class="scroll">
            <div class="container">
                <div use:asRoot={editor} class="editor" spellcheck="false" />
                <Sidebar active={sidebar} mode="narrow">
                    <p>Here comes the NLP results</p>
                </Sidebar>
            </div>
        </div>                 
    <!-- <Session documentId={document.documentId}>
        editor here?
    </Session> -->
<style>        
    .scroll {    
        overflow: auto;        
        height: calc(100% - 73px);
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
        height: calc(100% - 52px);     
        background: white;            
    }    

    .editor:active {
        border: none;
    }
  
    .editor:focus {
        border: none;
    }          
</style>