<script>  
    import { context } from "./stores.js";      
    import './smart-on-fhir';
    import { Editor } from "typewriter-editor";
    import Root from "typewriter-editor/lib/Root.svelte";    
    import Toolbar from "./components/Toolbar.svelte";        
    import Patient from "./components/Patient.svelte";        

    let error = null;
    let patient = null;
    let open = false;        
    
    let editor = new Editor();
    
    function toggleSidebar()
    {
        open = !open;
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

                    editor.setText(name);
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
<div class="main">
    <div class="toolbar">
        <Toolbar editor={editor} sidebar={open} on:toggleSidebar={toggleSidebar}/>
    </div>
    <div class="scroll">
        <div class="container">        
            <div class="content">                    
                <Root {editor} class="text-content">            
                </Root>
            </div>
            <div class="sidebar {open ? 'open': ''}">
                Sidebar
            </div>
        </div>
    </div>
</div>
{/if}

<style>
    .main {    
        overflow: hidden;
        height: calc(100%);
    }

    .toolbar {
        height: 46px;
        background: #cccccc;
    }
    
    .scroll {    
        overflow: auto;
        height: calc(100% - 46px);        
    }
    
    .container {    
        height: 100%;
        width: 100%;
        display: table;    
    }
    
    .sidebar {
        display: none;
        vertical-align: top;     
        background: #cccccc;   
    }

    .open {
        display: table-cell;
    }
    
    .content {
        display: table-cell;
        vertical-align: top;
        width: 70%;    
    }
    </style>