import fetch from "node-fetch";
import dipsColors from "../../dips-colors.js";
import Robot from "./Robot.js";

const normedtermurl = "http://localhost:8989/api/check";

const color_map = {
    "CONDITION": dipsColors.dips_red,
    "ANAT-LOC": dipsColors.warm_green,    
    "PROCEDURE": dipsColors.blue,    
    "DISCIPLINE": dipsColors.blue,    
    "SUBSTANCE": dipsColors.orange,    
    "MICROORGANISM": dipsColors.orange,
    "PHYSIOLOGY": dipsColors.cold_green,
    "ORGANIZATION": dipsColors.gray,
    "OTHER": dipsColors.gray,
    "PERSON": dipsColors.gray,
    "TOOL": dipsColors.gray,
    "ABBREV": dipsColors.gray
}

export default class NorMedTermRobot extends Robot {
    constructor(enabled) {
        super(enabled);
        this.color = dipsColors.cold_green;
        this.name = "NorMedTerm";
    }

    async doProcess(text) {
        const params = new URLSearchParams();
        params.append('text', text);

        try {
            const response = await fetch(
                normedtermurl,
                {
                    method: "post",
                    body: params
                }); 
            
            
            var values = [];
            const results = await response.json();
            results.map(result => {
                console.log(result);
                result.index.map(i => {                    
                    values.push(
                    {
                        word: result.term,
                        color: color_map[result.label],
                        index: i-1,
                        label: result.label
                    });
                });
            });    
            
            return values;

        } catch (error) {
            throw error;
        }                
    }
}
