import Delta from "quill-delta";
import toPlaintext from 'quill-delta-to-plaintext';
import { v4 } from "uuid";
import NorMedTermRobot from "./robots/NorMedTermRobot.js";
import DipsAskRobot from "./robots/DipsAskRobot.js";

export class Session {
    #deltaDoc;

    constructor(id, document, user, robotFactory) {
        console.log("ctor Session");
        this.id = id,
        this.#deltaDoc = new Delta(JSON.parse(document));        
        this.colors = ["#ebac23", "#b80058", "#008cf9", "#006e00", "#00bbad", "#d163e6", "#b24502", "#ff9287", "#5954d6", "#00c6f8"];
        user.color = this.colors[0];
        this.users = [user];
        this.robotSession = robotFactory.createRobotSession(this);
        this.identifier = v4();
        this.deltas = [];
    }

    deltaDocument = () => {
        return this.#deltaDoc;
    }

    document = () => {
        return JSON.stringify(this.#deltaDoc);
    }

    version = () => {   
        return this.deltas.length;
    }

    change(version, delta) {
        console.log("change")

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
        this.robotSession.update();

        // Store delta in history.
        this.deltas.push(recievedDelta);

        // It's the caller's responsibility to send the delta to all connected
        // clients and an acknowledgement to the creator.
        return recievedDelta;
    }

    enableRobot(name) {
        this.robotSession.setRobotEnabled(name, true);
    }

    disableRobot(name) {
        this.robotSession.setRobotEnabled(name, false);
    }

    robots = () => {
        return this.robotSession.robots;
    }

    clear() {
        this.robotSession.clear();
    }

    getText() {
        return toPlaintext(this.#deltaDoc);
    }

    addUser(user) {
        if (this.users.length < this.colors.length) {
            user.color = this.colors[this.users.length];
            this.users.push(user);
        }
    }

    removeUser(userId) {        
        var i = this.users.length;
        while(i--){
            if( this.users[i] &&
                this.users[i].id == userId) {
    
                this.users.splice(i,1);
                return;
            }
        }
    }                    

    hasMultipleUsers() {
        return this.users.length > 1;
    }
}