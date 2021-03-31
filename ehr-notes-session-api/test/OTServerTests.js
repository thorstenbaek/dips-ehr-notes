import assert from "assert";
import Delta from "quill-delta";
import OTServer from "../classes/OTServer.js";

const document = new Delta().insert("Gandalf the Grey").insert(", Frodo Lommelun").insert(" and Gollum").insert("are the masters of the Ring.");

describe("OTServer tests", () => {
    describe("constructor()", () => {
        it("no parameters", () => {
            var otServer = new OTServer();

            assert.ok(otServer);
            assert.strictEqual(0, otServer.document.length());
            assert.strictEqual(0, otServer.deltas.length);
        });

        it("with document parameter - has document", ( )=> {
            var otServer = new OTServer(document);

            assert.ok(otServer);
            assert.strictEqual(71, otServer.document.length());            
            assert.strictEqual(0, otServer.deltas.length);
        });

        it("with document and deltas parameters - has document and deltas", () => {
            const deltas = [
                new Delta().insert("First delta"),
                new Delta().insert("Second delta")]
            
            var otServer = new OTServer(document, deltas);
            assert.strictEqual(71, otServer.document.length());            
            assert.strictEqual(2, otServer.deltas.length);
        })
    });
    
    describe("receiveDelta()", () => {
        it("version parameter below null - throws Error", () => {
            var otServer = new OTServer(document);
            assert.throws(() => otServer.receiveDelta(-1), new Error("given delta version is not in history"));
        })

        it("version parameter ok, delta ok - value added", () => {
            var otServer = new OTServer(document);
            var results = otServer.receiveDelta(0, new Delta().insert("I edit this text."));            
            assert.strictEqual(17, results.length());
            assert.strictEqual(1, otServer.deltas.length);
        })

        it("new delta from old version - returns all newer deltas", () => {
            const deltas = [
                new Delta().insert("First delta"),
                new Delta().insert("Second delta"),
                new Delta().insert("Third delta")]
            var otServer = new OTServer(document, deltas);
            var results = otServer.receiveDelta(0, new Delta().insert("I was late..."));            

            assert.strictEqual(34, results.ops[0].retain);
        })
    });
})