<script>
    import { Editor } from "typewriter-editor";
    import Root from "typewriter-editor/lib/Root.svelte";    
    import Patient from "./Patient.svelte";
</script>

<Root {editor} class="text-content">
    <Patient/>
</Root>