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
        width: 250px;               
        background: lightgray;
    }
</style>