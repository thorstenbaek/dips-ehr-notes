<script>
	import {Router, Route} from 'svelte-routing';	
	import Launch from './Launch.svelte';
	import Home from './Home.svelte';	
	import {initSessions} from './SessionsStore';

	export let url = "";
	initSessions();
</script>

<Router url="{url}">	
	<Route path="/" component="{Launch}" />
	<Route path="app" component="{Home}" />
</Router>