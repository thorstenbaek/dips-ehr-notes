import fetch from "node-fetch";
import dipsColors from "../dips-colors.js";
import Robot from "./Robot.js";

const dipsAskUrl = "http://vp-ala04:8888/ent";

export default class DipsAskRobot extends Robot {
    constructor(session) {
        super(session);
        this.color = dipsColors.orange;
        this.name = "NorMedTerm";
    }

    async process() {
        const text = this.session.getText();

        const params = {
            "corpus": text
        };

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

        return new Promise((resolve, reject) => {
            resolve(values);
        });
    }
}