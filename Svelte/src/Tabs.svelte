<script>
    const template = 
        `content content content content content content content content content content content
        content content content content content content content content content content content
        content content content content content content content content content content content
        content content content content content content content content content content content
        content content content content content content content content content content content`;

    let content = template;
    let sidebar = template;

    function addToContent()
    {
        content += template;
    }

    function addToSidebar()
    {
        sidebar += template;
    }
    
</script>

<div class="main">
    <div class="toolbar">
        Toolbar
    </div>
    <div class="scroll">
        <div class="container">        
            <div class="content"><button class="addContent" on:click={addToContent}>add content</button>
                {content}
            </div>
            <div class="sidebar"><button class="addContent" on:click={addToSidebar}>add content</button>
                {sidebar}
            </div>
        </div>
    </div>
</div>

<style>

.main {    
    overflow: hidden;
    width: 100%; 
}

.toolbar {
    height: 25px;
}

.scroll {    
    overflow: scroll;
    height: calc(100% - 25px);
}

.container {    
    height: 100%;
    display: table;    
}

.sidebar {
    display: table-cell;
    vertical-align: top;
    background: #eeff;    
}

.content {
    display: table-cell;
    vertical-align: top;
    width: 70%;
    background: #ffffee;
}
</style>