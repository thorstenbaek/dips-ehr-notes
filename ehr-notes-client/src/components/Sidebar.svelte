<script> 
    export let active = false;
    export let mode = "wide";
</script>

<div class="sidebar {active ? 'open': ''} {mode}">
    <slot/>
</div>

<style>    
    .sidebar {        
        display: none;
        height: 100%;
        position: relative;
        vertical-align: top;     
        background: #cccccc;   
        padding: 10px;
    }

    .wide
    {
        width: 500px;
    }

    .narrow
    {
        width: 250px;
    }

    .open {
        display: table-cell;
    }
</style>