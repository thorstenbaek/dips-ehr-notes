<script>
	import {Router, Route} from 'svelte-routing';
	import Launch from './Launch.svelte';
	import Home from './Home.svelte';

	import { ApolloClient, InMemoryCache } from "@apollo/client/core";
    import { setClient } from "svelte-apollo";

	export let url = "";	

	const client = new ApolloClient({
		uri: "http://localhost:4000",
		cache: new InMemoryCache()
	});
	setClient(client);
</script>

<Router url="{url}">
	<Route path="/" component="{Launch}" />
	<Route path="app" component="{Home}" />
</Router>