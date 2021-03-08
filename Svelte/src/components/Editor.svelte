<script>
    import { Editor } from "typewriter-editor";
    import marked from 'marked'
    //Consider changing to this package supporting two way md-conversion: https://github.com/showdownjs/showdown
    import Root from "typewriter-editor/lib/Root.svelte";    
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
                <Root {editor} class="text-context" />   
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
</style>

