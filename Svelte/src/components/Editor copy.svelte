<script>
    import { Editor } from "typewriter-editor";
    import Root from "typewriter-editor/lib/Root.svelte";
    import Toolbar from 'typewriter-editor/lib/Toolbar.svelte';
    import Sidebar from "./Sidebar.svelte";

    const editor = new Editor();

    let sidebarIsOpen = true;        
    function toggleSidebar()
    {
        sidebarIsOpen = !sidebarIsOpen;
    }
    
</script>

<div class="container">
    <div class="content">
        <Root {editor} class="text-content"/>
    </div>
    <div class="sidebar">
    </div>
</div>

<!-- <div class="container">
    <Toolbar {editor} let:active let:commands>
        <div class="toolbar">            
            <button
                class="toolbar-button material-icons"
                class:active={active.bold}
                on:click={commands.bold}>format_bold</button>
            <button
                class="toolbar-button material-icons"
                class:active={active.italic}
                on:click={commands.italic}>format_italic</button>            
            <button
                class="toolbar-button material-icons"
                disabled={!active.undo}
                on:click={commands.undo}>undo</button>      
            <button
                class="toolbar-button material-icons"
                disabled={!active.redo}
                on:click={commands.redo}>redo</button>
            <button 
                class="toolbar-button right material-icons"                
                class:active={sidebarIsOpen}
                on:click={toggleSidebar}>view_sidebar</button>
            
        </div>
    </Toolbar>
    <div class="parent">
        <div class="editor" class:sidebarIsOpen>
            <Root {editor} class="text-content"/>
        </div>
        <Sidebar open={sidebarIsOpen}/>   
    </div>   

</div> -->

<style>
    .container {
        display: table;
        table-layout: auto;       
        overflow: scroll;
        height: 100%;
        width: 100%;
    }

    .content {
        display: table-cell;
        vertical-align: top;
        width: 70%;
        background: red;
    }

    .sidebar {
        display: table-cell;
        vertical-align: top;
        background: blue;
    }

    .sidebarIsOpen {
        width: 100%;
    }

    .toolbar {
        display: flex;
        background: #eee;
        padding: 8px;
        height: 50px;
    }
    .toolbar-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        margin: 0;
        width: 35px;
        height: 35px;
        margin-right: 4px;
        border-radius: 4px;
        border: 1px solid #ced4da;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;
    }

    .toolbar-button:hover {
        outline: none;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
        }
    .toolbar-button.active {
        border-color: #80bdff;
        background: #eaf4ff;
    }    
</style>