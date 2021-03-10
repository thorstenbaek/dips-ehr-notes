import assert from "assert";
import SessionManager from "../classes/SessionManager.js";



describe("SessionManager tests", () => {

    var sessionManager = new SessionManager();
    sessionManager.addSession("document1", "user1");
    sessionManager.addSession("document1", "user2");
    sessionManager.addSession("document1", "user3");

    sessionManager.addSession("document2", "user1");
    sessionManager.addSession("document2", "user2");
    sessionManager.addSession("document2", "user3");

    sessionManager.addSession("document3", "user1");
    sessionManager.addSession("document3", "user1");
    sessionManager.addSession("document3", "user1");

    describe("all()", () => {
        it("should return 3 separate sessions", () => {
            var sessions = sessionManager.all();
            assert.strictEqual(sessions.length, 3);
        });
    });

    describe("getByDocument", () => {
        it("with existing documentId should be ok", () => {
            var session = sessionManager.getByDocument("document1");
            assert.ok(session);            
            assert.strictEqual(session.document, "document1");
            assert.strictEqual(session.users.length, 3);
        });
        it("with non existing documentId should be null", () => {
            var sessions = sessionManager.getByDocument("documentX");
            assert.strictEqual(sessions, null);            
        });
    });

    describe("addSession", () => {
        it("add new user to existing document - adds user and returns created false", () => {
            var result = sessionManager.addSession("document1", "user4");
            assert.strictEqual(result.created, false);
            assert.strictEqual(result.session.users.length, 4);
        });
        it("add new user to new document - creates session with user", () => {
            var result = sessionManager.addSession("document4", "user4");
            assert.strictEqual(result.created, true);
            assert.strictEqual(result.session.document, "document4");
            assert.strictEqual(result.session.users.length, 1);
            assert.strictEqual(result.session.users[0], "user4");
        })
    });

    describe("removeSession", () => {
        it("remove user from session with multiple users - removes user and does not delete", () => {
            var result = sessionManager.removeSession("document2", "user3");
            assert.strictEqual(result.deleted, false);
            assert.strictEqual(result.session.users.length, 2);
        });
        it("remove non existing user from session with multiple users - does nothing", () => {
            var result = sessionManager.removeSession("document2", "userX");
            assert.strictEqual(result.deleted, false);
            assert.strictEqual(result.session.users.length, 2);
        });
        it("remove last user from session - deletes session", () => {
            sessionManager.removeSession("document2", "user2");
            var result = sessionManager.removeSession("document2", "user3");
            assert.strictEqual(result.deleted, true);
        });
        it("remove user from session with equal users - removes one user", () => {
            
            var result = sessionManager.removeSession("document3", "user1");
            assert.strictEqual(result.deleted, false);
            assert.strictEqual(result.session.users.length, 2);
        });
    });
});