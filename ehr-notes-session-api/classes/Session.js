import Delta from "quill-delta";
import { v4 } from "uuid";

export class Session {
    #deltaDoc;

    constructor(id, document, user) {
        this.id = id,
        this.#deltaDoc = new Delta(JSON.parse(document));        
        this.users = [user];
        this.identifier = v4();
        this.deltas = [];
    }

    document = () => {
        console.log(this.#deltaDoc);
        return JSON.stringify(this.#deltaDoc);
    }

    version = () => {
        return this.deltas.length;
    }

    change(version, delta) {
        if (version < 0 || this.deltas.length < version) {
            throw new Error("given delta version not in history");
        }

        // Find all deltas that the client didn't know of when it sent the
        // delta ...
        var concurrentDeltas = this.deltas.slice(version);        

        var recievedDelta = new Delta(JSON.parse(delta));

        // ... and transform the delta against all these deltas ...
        for (var i = 0; i < concurrentDeltas.length; i++) {
            var currentConcurrentDelta = new Delta(concurrentDeltas[i]);
            recievedDelta = currentConcurrentDelta.transform(recievedDelta, true);
        }

        // ... and apply that on the document
        this.#deltaDoc = this.#deltaDoc.compose(recievedDelta);

        // Store delta in history.
        this.deltas.push(recievedDelta);

        // It's the caller's responsibility to send the delta to all connected
        // clients and an acknowledgement to the creator.
        return recievedDelta;
    }

    addUser(user) {
        this.users.push(user);
    }

    removeUser(user) {
        var index = this.users.indexOf(user);
        if (index >= 0) {
            this.users.splice(index, 1);
        }        
    }

    hasMultipleUsers() {
        return this.users.length > 1;
    }
}