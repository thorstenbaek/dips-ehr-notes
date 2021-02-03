<script>  
    import { context } from "./stores.js";      
    import './smart-on-fhir';
    import { Editor } from "typewriter-editor";
    import Root from "typewriter-editor/lib/Root.svelte";    
    import Toolbar from "./components/Toolbar.svelte";        
    //import Sidebar from "./components/Sidebar.svelte";        

    let error = null;
    let open = true;        
    
    let editor = new Editor();
    
    function toggleSidebar()
    {
        open = !open;
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
                <Root {editor} class="text-content"/>
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