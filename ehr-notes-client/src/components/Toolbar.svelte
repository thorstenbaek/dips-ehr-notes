<script>
  import Toolbar from 'typewriter-editor/lib/Toolbar.svelte';
  import { createEventDispatcher } from 'svelte';

  export let editor;
  export let sidebar;

  const dispatch = createEventDispatcher();

</script>

<Toolbar {editor} let:active let:commands>
    <div class="toolbar">
        <button
          class="toolbar-button material-icons"
          title="Heading 2"
          class:active={active.header === 2}
          on:click={commands.header2}>title</button>
    
        <button
          class="toolbar-button material-icons header3"
          title="Heading 3"
          class:active={active.header === 3}
          on:click={commands.header3}>title</button>
    
        <button
          class="toolbar-button material-icons"
          title="Bullet list"
          class:active={active.list === "bullet"}
          on:click={commands.bulletList}>format_list_bulleted</button>

        <button
          class="toolbar-button material-icons"
          title="Ordered list"
          class:active={active.list === "ordered"}
          on:click={commands.orderedList}>format_list_numbered</button>

        <button
          class="toolbar-button material-icons"
          title="Bold"
          class:active={active.bold}
          on:click={commands.bold}>format_bold</button>
    
        <button
          class="toolbar-button material-icons"
          title="Italic"
          class:active={active.italic}
          on:click={commands.italic}>format_italic</button>                
        &nbsp;&nbsp;&nbsp;
        <button
          class="toolbar-button material-icons"
          title="Undo"
          disabled={!active.undo}
          on:click={commands.undo}>undo</button>
    
        <button
          class="toolbar-button material-icons"
          title="Redo"
          disabled={!active.redo}
          on:click={commands.redo}>redo</button>
        <button
          class="toolbar-button material-icons"
          class:active={sidebar}
          on:click={() => dispatch("toggleSidebar")}>view_sidebar</button>
      </div>
</Toolbar>

<style>
    .toolbar {      
      display: flex;      
      width: calc(100% - 16px);
      height: 30px;
      background: #ededed;
      padding:8px;
    }
    .toolbar-button {
      display: flex;      
      align-items: center;
      justify-content: center;
      background: #ededed;
      margin: 0;
      width: 30px;
      height: 30px;
      margin-right: 4px;
      cursor: pointer;
    }   

    .toolbar-button:hover {
      outline: none;
      background: #fdfdfd;      
    }
    .toolbar-button.active {
      background: #eaf4ff;
    }
    .header3 {
      font-size: 18px;
    }
</style>