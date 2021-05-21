import {pubsub} from "../../RobotResolvers.js";

const sleepInterval = 1500;

export default class RobotSession {

    constructor(session, robots) {
        this.session = session;
        this.dirty = true;        
        this.robots = robots;

        this.intervalId = setInterval(() => {
            try {                  
                if (this.dirty && robots.length > 0) {                                                        
                    var filteredRobots = this.robots.filter(r => r.enabled);
                    filteredRobots.map(async fr => {
                        var results = await fr.process(session.getText());                        
                        this.publish(this.session.id, fr.name, results);                                                    
                    });                   
                    
                    this.dirty = false;
                }
            } catch {

            }
        }, sleepInterval);        
    }

    publish(id, name, entities) {        
        pubsub.publish("ENTITIES_CHANGED", {
            entitiesChanged: {id, name, entities}});
    }                            
    

    update() {
        this.dirty = true;
    }

    setRobotEnabled(name, value) {
        var r = this.robots.filter(r => r.name === name);
        if (r.length > 0) {
            r[0].enabled = value;            
                        
            if (!value) {                 
                this.publish(this.session.id, r[0].name, []);
            } else {
                this.update();
            }
        }
    }
 
    clear() {
        clearInterval(this.intervalId);
    }
}

