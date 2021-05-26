import NorMedTermRobot from "./NorMedTermRobot.js";
import DipsAskRobot from "./DipsAskRobot.js";
import StartsWithERobot from "./StartsWithERobot.js";
import StartsWithSRobot from "./StartsWithSRobot.js";

export default class RobotManager {
    constructor() {
        this.robotDefinitions = {
            "Starts with e robot": () => new StartsWithERobot(false),
            "Starts with s robot": () => new StartsWithSRobot(false),
            "DIPS Ask": () => new DipsAskRobot(false),
            "NorMedTerm": () => new NorMedTermRobot(false)
        }

    }

    getRobots() {
        return this.robotDefinitions;        
    }
}
