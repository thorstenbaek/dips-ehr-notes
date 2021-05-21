
<script>
    import {session, disableRobot, enableRobot} from "../SessionsStore";
    
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

{#if $session?.robots}
    <ul>    
        <h3>Robots</h3>
        {#each $session.robots as robot}
        <li>
            <label>
                <input type="checkbox" value={robot.name} on:click={robotClick} checked={robots.some(r => r == robot.name)}/>
                {robot.name}
            </label>
        </li>
        {/each}
    </ul>
{/if}

<style>
    ul {
        padding: 0 0 0 10px;
    }
    li {
        display: inline;        
    }
</style>