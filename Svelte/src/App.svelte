<script>
	import {Router, Link, Route} from 'svelte-routing';
	import Launch from './Launch.svelte';
	import Home from './Home.svelte';

	export let url = "";	
</script>

<Router url="{url}">
	<Route path="/" component="{Launch}" />
	<Route path="app" component="{Home}" />
</Router>