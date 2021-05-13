import {pubsub} from "../RobotResolvers.js";
import StartsWithERobot from "./StartsWithERobot.js";
import StartsWithSRobot from "./StartsWithSRobot.js";

const sleepInterval = 1000;

export default class RobotManager {

    constructor(session) {
        this.session = session;
        this.dirty = true;
        this.robots = [];
        this.robots.push(new StartsWithERobot(session));
        this.robots.push(new StartsWithSRobot(session));
        

        setInterval(async () => {
            if (this.dirty) {                

                var results = await Promise.all(this.robots.map(r => r.process()));
                
                //console.log(`Updated ${entities.length} entities`);
                
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
        }, sleepInterval);
    }

    update() {
        this.dirty = true;
    }
}

