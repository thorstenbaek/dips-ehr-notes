<script>
	import {oauth2 as Smart} from 'fhirclient';
	import {onMount} from 'svelte';

	onMount(async () => {
		Smart.authorize({
			clientId: 'dips-ehr-notes',
			scope: 'launch launch/patient patient/DocumentReference.write patient/DocumentReference.read patient/Patient.read patient/encounter patient/resource online_access openid fhirUser',			
			redirectUri: './app',
			//iss:		 'https://dips.fhir.service.api.dips.no/',
			//launch:		 '62247e85-c8c1-4047-90b3-e0b3a9c59600'						

			 iss:		  'https://launch.smarthealthit.org/v/r3/sim/'
			  			+ 'eyJoIjoiMSIsImIiOiJmMDQ2MjkzNi1lYjRiLTRkYT'
			  			+ 'EtYjQ1YS1mYmQ5NmViZjhjY2IiLCJlIjoic21hcnQt'
			  			+ 'UHJhY3RpdGlvbmVyLTcxNjE0NTAyIn0/fhir',

		});
	});
</script>
