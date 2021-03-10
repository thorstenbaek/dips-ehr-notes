import { Session } from "./Session.js";
import { v4 } from "uuid";

var _sessions = [];

class SessionManager {                

    all() {
        return _sessions;
    }

    getByDocument(document) {
        var s = _sessions.filter(s => s.document == document);
        if (s.length == 0) {
            return null;
        }
        return s[0];
    }

    addSession(document, user) {
        var session = this.getByDocument(document);
        var created = false;

        if (session) {
            session.addUser(user);
        }
        else {
            session = new Session(v4(), document, user);
            created = true;
            _sessions.push(session);
        }
        
        return { session, created };
    }

    removeSession(document, user) {
        var session = this.getByDocument(document);               
        if (session)
        {
            var deleted = false;

            if (session.hasMultipleUsers()) {
                session.removeUser(user);
            }
            else
            {
                _sessions = _sessions.filter(s => s.id != session.id);
                deleted = true;
            }
            return { session, deleted };
        }
        else
        {
            return { error: true };
        }        
    }
}

export default SessionManager;