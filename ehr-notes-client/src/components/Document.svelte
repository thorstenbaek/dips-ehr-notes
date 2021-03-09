<script>
    import { resource } from '../SmartOnFhirStore.js';
    import Editor from './Editor.svelte';

    let markdown = null;

    $: {        
        markdown = $resource?.content[0].attachment?.data;    
    }
</script>

<Editor {markdown}/>
