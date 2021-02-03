<script>
    import { sidebar } from "../stores";
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

<div class="editor" class:sidebarIsOpen>
    <Toolbar {editor} let:active let:commands>
        <div class="toolbar">
            <!-- <button
                class="toolbar-button material-icons header1"
                class:active={active.header === 1}
                on:click={commands.header1}>title</button>
            <button
                class="toolbar-button material-icons header2"
                class:active={active.header === 2}
                on:click={commands.header2}>title</button>
            <button
                class="toolbar-button material-icons header3"
                class:active={active.header === 3}
                on:click={commands.header3}>title</button>
            <button
                class="toolbar-button material-icons normal"
                class:active={active.normal === true}
                on:click={commands.normal}>title</button> -->
            <button
                class="toolbar-button material-icons"
                class:active={active.bold}
                on:click={commands.bold}>format_bold</button>
            <button
                class="toolbar-button material-icons"
                class:active={active.italic}
                on:click={commands.italic}>format_italic</button>
            <!-- <button
                class="toolbar-button material-icons"
                class:active={active.underline}
                on:click={commands.underline}>format_underline</button> -->
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
    <Root {editor} class="text-content"/>
</div>
<Sidebar open={sidebarIsOpen}/>   
<style>
    .editor {
        float: left;
        padding: 10px;
        width: 100%;
        height: 80%;
    }

    .sidebarIsOpen {
        width: 65%;
    }

    .toolbar {
        display: flex;
        background: #eee;
        padding: 8px;
        margin-bottom: 8px;
        border-radius: 3px;
    }
    .toolbar-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        margin: 0;
        width: 40px;
        height: 40px;
        margin-right: 4px;
        border-radius: 4px;
        border: 1px solid #ced4da;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        cursor: pointer;
    }

    .right {
        right: 0;
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
    .header3 {
        font-size: 18px;
    }
</style>