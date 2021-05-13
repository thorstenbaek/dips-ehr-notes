import * as colors from "../dips-colors.js";
import Robot from "./Robot.js";

export default class StartsWithERobot extends Robot {

    constructor(session) {
        super(session);
        this.color = colors.dips_blue;
        this.name = "Starts with e robot"        
    }

    async process() {
        const regex = /\w+[æøåÆØÅ|\w+]*/g;
        const text = this.session.getText();
        
        var values = [];
        var result;
        while((result = regex.exec(text))) {
            const word = result.toString();
            if (word.startsWith('e') || word.startsWith('E')) {
                values.push(
                    {
                        word: word,
                        color: this.color,
                        index: result.index
                    });
            }
        }

        return new Promise((resolve, reject) => {
            resolve(values);
        })            
    }            
}