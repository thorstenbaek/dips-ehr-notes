import Delta from "quill-delta";

export default class OTServer {
    constructor(document, deltas) {
        this.document = new Delta(document);
        this.deltas = deltas || [];
    }

    receiveDelta = (version, delta) => {
        if (version < 0 || this.deltas.length < version) {
            throw new Error("given delta version is not in history");
        }

        // Find all deltas that the client didn't know of when it sent the delta ...
        var concurrentDeltas = this.deltas.slice(version);

        var recievedDelta = new Delta(delta);

        // ... and transform the delta against all these deltas ...
        for (var i = 0; i < concurrentDeltas.length; i++) {
            var currentConcurrentDelta = new Delta(concurrentDeltas[i]);
            recievedDelta = currentConcurrentDelta.transform(recievedDelta, true);
        }   

        // ... and apply that on the document
        this.document = this.document.compose(recievedDelta);

        // Store delta in history.
        this.deltas.push(recievedDelta);

        // It's the caller's responsibility to send the delta to all connected
        // clients and an acknowledgement to the creator.
        return recievedDelta;
    };
}