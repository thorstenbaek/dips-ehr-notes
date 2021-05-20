import fetch from "node-fetch";
import dipsColors from "../../dips-colors.js";
import Robot from "./Robot.js";

const dipsAskUrl = "http://vp-ala04:8888/ent";

export default class DipsAskRobot extends Robot {
    constructor() {
        super();
        this.color = dipsColors.orange;
        this.name = "DIPS Ask";
    }

    async process(text) {
        const params = {
            "corpus": text
        };

        try {
            const response = await fetch(
                dipsAskUrl,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "post",
                    body: JSON.stringify(params)
                }); 
            
            
            var values = [];
            const results = await response.json();
            console.log(results);
            results.map(result => {
                values.push(
                {
                    word: result.text,
                    color: this.color,
                    index: result.start
                });
            });
            
            return values;

        } catch (error) {
            
        }
    }
}