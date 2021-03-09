<script>
    import { derived } from "svelte/store";
    import { query } from "svelte-apollo";
    import gql from 'graphql-tag';    

    const SESSION_QUERY = gql`
        query {
            session(documentId:17) {
            id
            users
        }}`;                
    const sessionQuery = query(SESSION_QUERY);      

    function LoadSession(_document, set) {                              
        if (!_document)
        {
            return;
        }
        
        sessionQuery.result().then(session => {                        
            if (session.data == null)
            {
                throw new Error("Failed to load session");
            }
            set(session.data.session);
        });
    }
    
    export const session = derived(document, LoadSession);

</script>

<p>
    Sessions: {$session?.users}
</p>