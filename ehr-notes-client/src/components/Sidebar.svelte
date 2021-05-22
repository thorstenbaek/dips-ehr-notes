<script>
    export let visible;
</script>

{#if visible}
<div class="sidebar {visible?'':'hidden'}">
    <slot/>
</div>
{/if}

<style>    
    .sidebar {
        display: table-cell;
        vertical-align: top;
        padding: 0;        
        margin: 0;
        width: 250px;                       
        background: #d4d7d9;        
    }
</style>