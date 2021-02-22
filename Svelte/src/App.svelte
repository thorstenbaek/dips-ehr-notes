<script>
	import { ApolloClient, InMemoryCache } from "@apollo/client/core";
	import { WebSocketLink } from "@apollo/client/link/ws";
	import { HttpLink } from 'apollo-link-http';
	import { split } from 'apollo-link';
	import { getMainDefinition } from 'apollo-utilities';
	import { setClient } from "svelte-apollo";
	import {Router, Route} from 'svelte-routing';	
	import Launch from './Launch.svelte';
	import Home from './Home.svelte';	

	const httpLink = new HttpLink({
	uri: 'http://localhost:4000'
	});
	const wsLink = new WebSocketLink({
		uri: `ws://localhost:4000/subscriptions`,		
	options: {
		reconnect: true
	}
	});

	const link = split(
	// split based on operation type
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
		definition.kind === 'OperationDefinition' &&
		definition.operation === 'subscription'
		);
	},
		wsLink,
		httpLink,
	);

	const client = new ApolloClient({
		link,
		cache: new InMemoryCache()
	});
	setClient(client);

	export let url = "";
</script>

<Router url="{url}">	
	<Route path="/" component="{Launch}" />
	<Route path="app" component="{Home}" />
</Router>