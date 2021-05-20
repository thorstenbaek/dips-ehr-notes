import {pubsub} from "../../RobotResolvers.js";

const sleepInterval = 1500;

export default class RobotSession {

    constructor(session, robots) {
        this.session = session;
        this.dirty = true;        
        this.robots = robots;

        this.intervalId = setInterval(async () => {
            try {                  
                if (this.dirty && robots.length > 0) {                                                        
                    var filteredRobots = this.robots.filter(r => r.enabled);
                    var results = await Promise.all(filteredRobots.map(
                        r => r.process(session.getText())));

                    if (results.length > 0) {
                        for(var i = 0; i < results.length; i++) {
                            this.publish(this.session.id, filteredRobots[i].name, results[i]);                            
                        }                            
                    } 
                    
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

