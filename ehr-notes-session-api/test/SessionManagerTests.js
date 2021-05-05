import assert from "assert";
import SessionManager from "../classes/SessionManager.js";
import User from "../classes/User.js";

describe("SessionManager tests", () => {

    const emptyJson = "{}";

    var sessionManager = new SessionManager();
    sessionManager.addSession("document1", emptyJson, new User("user1", "instance1", "color1"));
    sessionManager.addSession("document1", emptyJson, new User("user2", "instance2", "color2"));
    sessionManager.addSession("document1", emptyJson, new User("user3", "instance3", "color3"));

    sessionManager.addSession("document2", emptyJson, new User("user1", "instance1", "color1"));
    sessionManager.addSession("document2", emptyJson, new User("user2", "instance2", "color2"));
    sessionManager.addSession("document2", emptyJson, new User("user3", "instance3", "color3"));

    sessionManager.addSession("document3", emptyJson, new User("user1", "instance1", "color1"));
    sessionManager.addSession("document3", emptyJson, new User("user2", "instance2", "color2"));
    sessionManager.addSession("document3", emptyJson, new User("user3", "instance3", "color3"));


    describe("all()", () => {
        it("should return 3 separate sessions", () => {
            var sessions = sessionManager.all();
            assert.strictEqual(sessions.length, 3);
        });
    });

    describe("getById", () => {
        it("with existing documentId should be ok", () => {
            var session = sessionManager.getById("document1");
            assert.ok(session);            
            assert.strictEqual(session.id, "document1");
            assert.strictEqual(session.users.length, 3);
        });
        it("with non existing documentId should be null", () => {
            var sessions = sessionManager.getById("documentX");
            assert.strictEqual(sessions, null);            
        });
    });

    describe("addSession", () => {
        it("add new user to existing document - adds user and returns created false", () => {
            var result = sessionManager.addSession("document1", emptyJson, new User("user4", "instance4", "color4"));
            assert.strictEqual(result.created, false);
            assert.strictEqual(result.session.users.length, 4);
        });
        it("add new user to new document - creates new session with one user", () => {
            var result = sessionManager.addSession("document4", emptyJson, new User("user4", "instance4", "color4"));
            assert.strictEqual(result.created, true);
            assert.strictEqual(result.session.id, "document4");
            assert.strictEqual(result.session.users.length, 1);
            assert.strictEqual(result.session.users[0].id, "user4");
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

    describe("flush", () => {
        it("returns all sessions and empties sessions list", () => {
            const sessions = sessionManager.flush();
            assert.strictEqual(sessions.length, 3);
            assert.strictEqual(sessionManager.isEmpty(), true);
        })
    });
});