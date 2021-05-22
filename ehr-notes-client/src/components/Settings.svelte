
<script>
    import {session, disableRobot, enableRobot} from "../SessionsStore";
    
    export let visible;
    let robots = [];

    session.subscribe(s => {      
        robots = [];  
        s?.robots.map(r => {
            if (r.enabled) {
                robots = [...robots, r.name];
            }
        })
    });
    
    
    function robotClick(e) {		
		var value = e?.target?.value;
		if (value !== null) {
			var count = robots.length;			
			robots = robots.filter(s => s != value);
			
			if (count === robots.length) {
				robots = [...robots, value]
				enableRobot($session.id, value);
			}
			else {
				disableRobot($session.id, value);
			}
		}
	}		

</script>

{#if visible && $session?.robots}
    <div class="settings">
        <h4>NLP Settings</h4>
        <p>Select NLP-Robots to activate</p>
        <ul>    
            {#each $session.robots as robot}
            <li>
                <label>
                    <input type="checkbox" value={robot.name} on:click={robotClick} checked={robots.some(r => r == robot.name)}/>
                    {robot.name}
                </label>
            </li>
            {/each}
        </ul>
    </div>
{/if}

<style>
    .settings {
        margin: 4px;
        padding: 4px;
        background: #e9ecef;    
    }

    ul {
        margin: 0;
        padding: 0;
    }
    li {
        display: inline;        
    }

    p { 
        margin: 0 0 5px 0;
    }
    h4 {
        margin: 0 0 5px 0;
    }
</style>