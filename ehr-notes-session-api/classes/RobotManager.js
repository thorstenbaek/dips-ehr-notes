import Robot from "./Robot";

export default class RobotManager {

    constructor() {
        this.robots = [];
        this.robots.push(new Robot());
    }
}

