import {pubsub} from "../RobotResolvers.js";


const sleepInterval = 1000;

export default class Robot {

    constructor(session) {
        this.name = "Some robot"        
        this.session = session;
        this.dirty = true;
        this.entities = [];

        setInterval(async () => {
            if (this.dirty) {                
                var e = await this.process(session.getText());
                if (e.length != this.entities.length)
                {
                    this.entities = e;
                    console.log(`Updated ${this.entities.length} entities`);
                    pubsub.publish("ENTITIES_CHANGED", {
                    entitiesChanged: {
                        id: this.session.id,
                        name: "test",
                        entities: this.entities                        
                    }});
                }
                
                this.dirty = false;
            }
        }, sleepInterval);
    }

    update() {
        this.dirty = true;
    }

    async process(text) {
        let regex = /\w+[æøåÆØÅ|\w+]*/g;
        
        var values = [];
        var result;
        while((result = regex.exec(text))) {
            values.push(
                {
                    word: result.toString(),
                    index: result.index
                });
        }

        return new Promise((resolve, reject) => {
            resolve(values);
        })            
    }            
}