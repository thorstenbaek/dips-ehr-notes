<script>
	import {oauth2 as Smart} from 'fhirclient';
	import {onMount} from 'svelte';

	onMount(async () => {
		Smart.authorize({
			clientId: 'dips-ehr-notes',
			scope: 'launch launch/patient patient/*.write patient/read offline_access openid fhirUser',
			redirectUri: './app',
			iss:		  'https://launch.smarthealthit.org/v/r3/sim/'
						+ 'eyJoIjoiMSIsImIiOiJmMDQ2MjkzNi1lYjRiLTRkYT'
						+ 'EtYjQ1YS1mYmQ5NmViZjhjY2IiLCJlIjoic21hcnQt'
						+ 'UHJhY3RpdGlvbmVyLTcxNjE0NTAyIn0/fhir',

		});
	});
</script>