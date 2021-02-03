<script> 
    export let open = false;
</script>

<aside class:open>
    <div>
        Sidebar
    </div>
</aside>

<style>
    aside {
        float: bottom;
        visibility: collapse;        
        width: 0;        
        height: 0;
        background: #eee;
    }

    .open {
        float: left;
        width: 35%;
        height: 100%;
        visibility: visible;
    }
</style>