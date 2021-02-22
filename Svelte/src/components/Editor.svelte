<script>
    import { Editor } from "typewriter-editor";
    import marked from 'marked'
    import { createEventDispatcher } from 'svelte';    
    //Consider changing to this package supporting two way md-conversion: https://github.com/showdownjs/showdown
    import Root from "typewriter-editor/lib/Root.svelte";    
    import Toolbar from "./Toolbar.svelte";            
    import Session from "./Session.svelte";
    import Sidebar from "./Sidebar.svelte";

    const dispatch = createEventDispatcher();

    export let document = null;
    let sidebar = false;            
    let session = null;

    let editor = new Editor();
    editor.on("change", delta => {        
        if (delta != null && delta.change != null) {
            console.log(delta?.change);
        }
    })

    $:{
        if (document != null)
        {                    
            editor.setHTML(marked(document.markdown));                            
            session = document.session;
        }
        else
        {
            editor.setText(null);
            session = null;
        }
    }

    function toggleSidebar()
    {
        sidebar = !sidebar;
    }   
    
    function closeDocument()
    {
        document = null;
        dispatch("showDialog");
    }

</script>
    {#if document}
        <Toolbar editor={editor} 
                sidebar={sidebar} 
            on:newDocument={() => closeDocument()} 
            on:openDocument={() => closeDocument()}
            on:closeDocument={() => closeDocument()}
            on:toggleSidebar={toggleSidebar} />
        <Session documentId={document.documentId}>
            <div class="scroll">
                <div class="container">            
                    <Root {editor} class="text-content" />                    
                    <Sidebar active={sidebar} mode="narrow"> 
                        <p>Here comes the NLP results</p>
                    </Sidebar>
                </div>
            </div>       
        </Session>
    {/if}
<style>        
    .scroll {    
        overflow: auto;
        height: 100%;        
    }
    
    .container {    
        overflow: hidden;
        height: 100%;
        width: 100%;
        display: table;    
    }    
        
</style>

