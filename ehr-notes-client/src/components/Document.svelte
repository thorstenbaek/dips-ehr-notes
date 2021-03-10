<script>
    import { resource } from '../SmartOnFhirStore.js';
    import Editor from './Editor.svelte';

    let document = null;

    $: {                
        if ($resource) {            
            document = {
                id: $resource.id,
                title: $resource.description,
                markdown: $resource.content[0].attachment?.data
            }
        }
    }
</script>

<Editor {document}/>
