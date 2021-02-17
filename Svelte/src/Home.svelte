<script>  
    import './smart-on-fhir';
    import { onDestroy } from 'svelte';
    import { context } from "./stores.js";      
    import { Editor } from "typewriter-editor";
    import marked from 'marked'
    //Consider changing to this package supporting two way md-conversion: https://github.com/showdownjs/showdown
    import Root from "typewriter-editor/lib/Root.svelte";    
    import DialogContainer from "./components/DialogContainer.svelte";
    import Toolbar from "./components/Toolbar.svelte";        
    import Sidebar from "./components/Sidebar.svelte";
    import DocumentList from "./components/DocumentList.svelte";        
    import Session from './classes/Session.js';

    let error = null;
    let sidebar = false;        
    let left = false;        
    let showDialog = true;
    let session = null;
    let document = null;
    
    onDestroy(() => {
        console.log("Destroying");
    });
    
    let editor = new Editor();
    editor.on("change", delta => {
        if (session == null)
        {
            session = new Session(document.id);
        }

        if (delta != null && delta.change != null) {
            console.log(delta?.change);
        }
    })
    
    function closeOverlay()
    {
        showDialog = false;
    }    

    function openDocument(arg)
    {
        //session.Close();
        session = null;
        
        document = arg.detail;
        editor.setHTML(marked(arg.detail.markdown));                
    }    

    function toggleSidebar()
    {
        sidebar = !sidebar;
    }    

    $: {
        $context?.client?.patient.read()
            .then(p => {
                if (p != null)
                {
                    var name = "";
                    p.name[0].given.forEach(g =>
                    {
                        name += g + " ";
                    });
                    
                    name += p.name[0].family;

                    // editor.setText(name); //TODO add this as general template variable resolution
                }                    
            });
    }

    $: {
        error = $context?.error;
    }
</script>

{#if error != null}
    <p>{error}</p>    
{:else}     
    <DialogContainer {showDialog} on:close={closeOverlay}>
        <DocumentList on:openDocument={openDocument}/>
    </DialogContainer>
    <Toolbar editor={editor} 
        sidebar={left} 
        on:newDocument={() => {showDialog = true}} 
        on:openDocument={() => {showDialog = true}} 
        on:toggleSidebar={toggleSidebar} />
    
    <div class="scroll">
        <div class="container">                                
            <Root {editor} class="text-content" />            
            <Sidebar active={sidebar} mode="narrow"> 
                <p>Her comes the NLP results</p>
            </Sidebar>
        </div>
    </div>       
{/if}

<style>        
    .scroll {    
        overflow: auto;
        height: calc(100% - 58px);        
    }
    
    .container {    
        overflow: hidden;
        height: 100%;
        width: 100%;
        display: table;    
    }    
        
</style>