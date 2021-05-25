import fetch from "node-fetch";
import dipsColors from "../../dips-colors.js";
import Robot from "./Robot.js";

const dipsAskUrl = "http://vp-ala04:8888/ent";

const color_map = {
    "ICNP_T": dipsColors.cold_green,
    "ICNP_A": dipsColors.cold_green,
    "ICNP_C": dipsColors.cold_green,
    "ICNP_J": dipsColors.cold_green,
    "ICNP_F": dipsColors.cold_green,
    "ICNP_M": dipsColors.cold_green,
    "ICNP_DC": dipsColors.cold_green,
    "ICD10": dipsColors.blue,
    "ANATOMY": dipsColors.warm_green,
    "MEDICATION": dipsColors.orange,    
    "OBSERVATION": dipsColors.dips_red,
    "ORG": dipsColors.gray,
    "EVT": dipsColors.gray,
    "PER": dipsColors.gray,
    "LAB": dipsColors.gray,
    "LOC": dipsColors.gray,
    "PROD": dipsColors.gray
}

export default class DipsAskRobot extends Robot {
    constructor(enabled) {
        super(enabled);
        this.color = dipsColors.orange;
        this.name = "DIPS Ask";
    }

    async doProcess(text) {
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
            results.map(result => {
                values.push(
                {
                    word: result.text,
                    color: (result.label in color_map) ? color_map[result.label] : dipsColors.gray,
                    index: result.start,
                    label: result.label
                });
            });
                        
            return values;            

        } catch (error) {
            console.log(error);
        }
    }
}