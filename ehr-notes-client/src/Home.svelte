<script>  
    import SmartOnFhir from "./components/SmartOnFhir.svelte";
    import Document from "./components/Document.svelte";
    
    function beforeunload(event) {        
        console.log("close" + event);        
    }

</script>

<svelte:window on:beforeunload={beforeunload}/>
<SmartOnFhir/>
<Document/>