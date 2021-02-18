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

    let session = null;
    export let document = null;
    let sidebar = false;            

    let editor = new Editor();
    editor.on("change", delta => {        
        if (delta != null && delta.change != null) {
            console.log(delta?.change);
        }
    })

    $:{
        //session.Close();
        //session = null;
        if (document != null)
        {
            editor.setHTML(marked(document.markdown));                
        }
    }

    function toggleSidebar()
    {
        sidebar = !sidebar;
    }        

</script>
    {#if document}
    <Toolbar editor={editor} 
            sidebar={sidebar} 
        on:newDocument={() => dispatch("showDialog")} 
        on:openDocument={() => dispatch("showDialog")} 
        on:closeDocument={() => {
                document = null;
                dispatch("showDialog");}} 
        on:toggleSidebar={toggleSidebar} />
    <Session document={document}>
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

