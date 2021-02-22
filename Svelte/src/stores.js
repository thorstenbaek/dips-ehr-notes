import { writable, readable } from "svelte/store";
import asyncable from "svelte-asyncable";
import { query } from "svelte-apollo";
import gql from "graphql-tag";
import v4 from "uuid";

export const user = readable(v4());
export const context = writable(null);
export const sidebar = writable(null);

export const sessionsStore = asyncable(async () => {
    /*const res = await new Promise((resolve, reject) => {
        const SESSIONS_QUERY = gql`
            query {
                sessions {
                    documentId
                }
            }`;
        const sessions = await query(SESSIONS_QUERY).result();
        resolve(sessions);        
    });    

    return res;*/
    const SESSIONS_QUERY = gql`
        query {
            sessions {
                documentId
            }
        }`;
    
    var sessions = await query(SESSIONS_QUERY).result();    
    return sessions.data.sessions;
});







