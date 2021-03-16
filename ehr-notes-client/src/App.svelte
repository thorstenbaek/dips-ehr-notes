<script>
	import {Router, Route} from 'svelte-routing';	
	import Launch from './Launch.svelte';
	import Home from './Home.svelte';	
	import {initSessions} from './SessionsStore';
	import {settings} from "./stores";

	export let url = "";
	
$:  {
	if ($settings) {		
		initSessions();
	}
}
	

</script>

{#if $settings}
<Router url="{url}">	
	<Route path="/" component="{Launch}" />
	<Route path="app" component="{Home}" />
</Router>
{:else}
	Loading settings...
{/if}