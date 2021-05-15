import fetch from "node-fetch";
import dipsColors from "../dips-colors.js";
import Robot from "./Robot.js";

const normedtermurl = "http://localhost:8989/api/check";

export default class NorMedTermRobot extends Robot {
    constructor(session) {
        super(session);
        this.color = dipsColors.cold_green;
        this.name = "NorMedTerm";
    }

    async process() {
        const text = this.session.getText();

        const params = new URLSearchParams();
        params.append('text', text);

        const response = await fetch(
            normedtermurl,
            {
                method: "post",
                body: params
            }); 
        
        
        var values = [];
        const results = await response.json();
        results.map(result => {
            result.index.map(i => {
                values.push(
                {
                    word: result.term,
                    color: this.color,
                    index: i-1
                });
            });
        });       

        return new Promise((resolve, reject) => {
            resolve(values);
        });
    }
}
