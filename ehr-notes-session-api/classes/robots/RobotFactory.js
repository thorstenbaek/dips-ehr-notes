import RobotSession from "./RobotSession.js";

class RobotFactory {
    constructor(robotManager) {        
        this.robotManager = robotManager;        
    }

    createRobotSession(session) {

        var robotDefinitions = this.robotManager.getRobots();
        console.log(robotDefinitions);

        let robots = [];
        for(const [key, value] of Object.entries(robotDefinitions) )
        {            
            try {
                const robot = value();            
                robots.push(robot);
            } catch (error) {
                console.error(error);
            }
        }
        console.log("robots", robots);

        return new RobotSession(session, robots);
    }
}

export default RobotFactory;