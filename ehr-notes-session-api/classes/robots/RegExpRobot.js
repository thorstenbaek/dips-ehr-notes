import * as colors from "../../dips-colors.js";
import Robot from "./Robot.js";

export default class RegExpRobot extends Robot {

    constructor() {
        super();
        this.color = colors.dips_blue;
        this.name = "Regexp robot"        
    }

    async process(text) {
        const regex = /\w+[æøåÆØÅ|\w+]*/g;
        
        var values = [];
        var result;
        while((result = regex.exec(text))) {
            values.push(
                {
                    word: result.toString(),
                    color: this.color,
                    index: result.index
                });
        }

        return new Promise((resolve, reject) => {
            resolve(values);
        })            
    }            
}