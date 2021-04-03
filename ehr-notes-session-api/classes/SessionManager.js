import { Session } from "./Session.js";

var _sessions = [];

class SessionManager {                
    all() {
        return _sessions;
    }

    getById(id) {
        var s = _sessions.filter(s => s.id == id);
        if (s.length == 0) {
            return null;
        }
        return s[0];
    }

    addSession(id, document, user) {
        var session = this.getById(id);
        var created = false;

        if (session) {
            session.addUser(user);
        }
        else {
            session = new Session(id, document, user);
            created = true;
            _sessions.push(session);
        }
        
        return { session, created };
    }

    removeSession(id, user) {
        var session = this.getById(id);               
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

    flush() {
        const sessions = _sessions;
        _sessions = [];
        return sessions;
    }

    isEmpty() {
        return _sessions?.length == 0;
    }

}

export default SessionManager;