<script>
import Toolbar from 'typewriter-editor/lib/Toolbar.svelte';
import { createEventDispatcher } from 'svelte';

export let editor;
export let sidebar;

const dispatch = createEventDispatcher();

function toggleSidebar()
{
    dispatch("toggleSidebar");
}

</script>

<Toolbar {editor} let:active let:commands>
    <div class="toolbar">
        <button
          class="toolbar-button material-icons"
          class:active={active.header === 2}
          on:click={commands.header2}>title</button>
    
        <button
          class="toolbar-button material-icons header3"
          class:active={active.header === 3}
          on:click={commands.header3}>title</button>
    
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
          class="toolbar-button material-icons right"
          class:active={sidebar}
          on:click={toggleSidebar}>view_sidebar</button>
      </div>
</Toolbar>

<style>
    .toolbar {
      display: flex;      
      background: #eee;
      padding: 8px;
      margin-bottom: 8px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px rgba(0, 0, 0, .1);
    }
    .toolbar-button {
      display: flex;      
      align-items: center;
      justify-content: center;
      background: #fff;
      margin: 0;
      width: 30px;
      height: 30px;
      margin-right: 4px;
      border-radius: 4px;
      border: 1px solid #ced4da;
      transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
      cursor: pointer;
    }

    .right {
      flex-direction: row-reverse;  
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