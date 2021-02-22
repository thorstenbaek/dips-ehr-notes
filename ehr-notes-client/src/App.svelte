<script>
	import {Router, Route} from "svelte-routing";
	import Home from "./Home.svelte";
	import Launch from "./Launch.svelte";

	export let url = "";
</script>

<Router url="{url}">	
	<Route path="/" component="{Launch}" />
	<Route path="app" component="{Home}" />
</Router>