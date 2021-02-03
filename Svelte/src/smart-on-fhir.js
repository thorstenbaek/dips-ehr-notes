import { oauth2 as Smart } from 'fhirclient';
import { context } from "./stores";

Smart.ready()
    .then(client => {
        var newContext = {
            client: client,
            error: null
        };
        context.update(c => c = newContext)})
    .catch(error => {
        var newContext = {
            client: null,
            error: error
        };
        context.update(c => c = newContext)});
