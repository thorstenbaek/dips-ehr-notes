import dipsColors from "../../dips-colors.js";
import Robot from "./Robot.js";

export default class StartsWithERobot extends Robot {

    constructor(enabled) {
        super(enabled);
        this.color = dipsColors.dips_blue;
        this.name = "Starts with e robot"        
    }

    async doProcess(text) {
        const regex = /\w+[æøåÆØÅ|\w+]*/g;
        
        var values = [];
        var result;
        while((result = regex.exec(text))) {
            const word = result.toString();
            if (word.startsWith('e') || word.startsWith('E')) {
                values.push(
                    {
                        word: word,
                        color: this.color,
                        index: result.index,
                        label: 'e'
                    });
            }
        }

        return new Promise((resolve, reject) => {
            resolve(values);
        })            
    }            
}