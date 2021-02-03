<script>
	import {Router, Route} from 'svelte-routing';
	import Launch from './Launch.svelte';
	import Home from './Home.svelte';
	import Tabs from './Tabs.svelte';

	export let url = "";	
</script>

<Router url="{url}">
	<Route path="/" component="{Launch}" />
	<Route path="app" component="{Home}" />
	<Route path="tabs" component="{Tabs}" />
</Router>