import NorMedTermRobot from "./NorMedTermRobot.js";
import DipsAskRobot from "./DipsAskRobot.js";
import StartsWithERobot from "./StartsWithERobot.js";
import StartsWithSRobot from "./StartsWithSRobot.js";

export default class RobotManager {
    constructor() {
        this.robotDefinitions = {
            "Starts with E": () => new StartsWithERobot(),
            "Starts with S": () => new StartsWithSRobot(),
            "DIPS Ask": () => new DipsAskRobot(),
            "NorMedTerm": () => new NorMedTermRobot()
        }

    }

    getRobots() {
        return this.robotDefinitions;        
    }
}
