<script>  
    import { onDestroy } from 'svelte';    
    
    import Editor from "./components/Editor.svelte";
    import DialogContainer from "./components/DialogContainer.svelte";
    import DocumentList from "./components/DocumentList.svelte";        
    import Document from "./classes/Document.js";
    
    let showDialog = true;
    let document = null;
    
    onDestroy(() => {
        console.log("Destroying");
    });
           
    function closeOverlay()
    {
        showDialog = false;
    }    

    function openDocument(args) {
        document = args.detail
    }
    
</script>

<DialogContainer {showDialog} on:close={closeOverlay}>
    <DocumentList on:openDocument={openDocument}/>
</DialogContainer>
<Editor document={document} on:showDialog={() => showDialog = true}/>