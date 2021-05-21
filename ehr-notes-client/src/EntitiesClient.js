import gql from 'graphql-tag';
import { setClient, mutation, subscribe } from "svelte-apollo";

export default class EntitiesClient {

    constructor(editor) {
        this.editor = editor;
        this.entitiesChangedSubscription = null;
        this.entitiesChangedUnsubscriber = null;
    }

    subscribe(id, callback) {
        console.log("Subscribing for changes to entities " + id);
    
        const ENTITIESCHANGED_SUBSCRIPTION = gql`
            subscription($id:String!) {
                entitiesChanged(id:$id){
                name
                entities {
                    word
                    color
                    index
                    label
                }}}`;

                this.entitiesChangedSubscription = subscribe(ENTITIESCHANGED_SUBSCRIPTION, {
            variables: {            
                id: id
        }});
        
        this.entitiesChangedUnsubscriber = this.entitiesChangedSubscription.subscribe(        
            result => {            
                if (result?.data?.entitiesChanged) {
                    callback(result.data.entitiesChanged);
                }
            });
    }

    unsubscribe() {
        if (this.entitiesChangedUnsubscriber) {
            this.entitiesChangedUnsubscriber();
        }
    }
}