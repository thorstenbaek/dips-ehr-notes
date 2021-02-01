<script>
	import {Router, Link, Route} from "svelte-routing";
	import About from './About.svelte';
	import Home from './Home.svelte';

	let url = "";
</script>

<Router url="{url}">
	<nav>
		<Link to="/">Home</Link>
		<Link to="about">About</Link>		
	</nav>

	<Route path="/" component="{Home}" />
	<Route path="about" component="{About}" />
</Router>

