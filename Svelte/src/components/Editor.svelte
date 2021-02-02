<script>
    import { Editor } from "typewriter-editor";
    import Root from "typewriter-editor/lib/Root.svelte";

    const editor = new Editor();
</script>

<Root {editor} class="text-content">
    <h1>Daglig notat</h1>
    <p></p>
    
</Root>