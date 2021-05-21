import dipsColors from "../../dips-colors.js";
import Robot from "./Robot.js";

export default class StartsWithSRobot extends Robot {

    constructor(enabled) {
        super(enabled);
        this.color = dipsColors.dips_red;
        this.name = "Starts with s robot"        
    }

    async doProcess(text) {
        const regex = /\w+[æøåÆØÅ|\w+]*/g;
        
        var values = [];
        var result;
        while((result = regex.exec(text))) {
            const word = result.toString();
            if (word.startsWith('s') || word.startsWith('S')) {
                values.push(
                    {
                        word: word,
                        color: this.color,
                        index: result.index,
                        label: 's'
                    });
            }
        }

        return new Promise((resolve, reject) => {
            resolve(values);
        })            
    }            
}