import {pubsub} from "../../RobotResolvers.js";

const sleepInterval = 1500;

export default class RobotSession {

    constructor(session, robots) {
        this.session = session;
        this.dirty = true;        
        this.robots = robots;

        this.intervalId = setInterval(async () => {
            try {   
                console.log("interval");
                
                if (this.dirty && robots.length > 0) {                                    
                    
                    var activeRobots = this.robots.filter(r => r.active);
                    var results = await Promise.all(activeRobots.map(r => r.process(session.getText())));
                    
                    for(var i = 0; i < results.length; i++) {
                        console.log(results[i]);

                        pubsub.publish("ENTITIES_CHANGED", {
                            entitiesChanged: {
                                id: this.session.id,                            
                                name: this.robots[i].name,
                                entities: results[i]
                            }});
                    }
                    
                    this.dirty = false;
                }
            } catch {

            }
        }, sleepInterval);
    }

    update() {
        this.dirty = true;
    }

    clear() {
        clearInterval(this.intervalId);
    }
}

