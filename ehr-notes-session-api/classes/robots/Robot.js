export default class Robot {

    constructor(enabled) {
        this.enabled = enabled;
        this.isprocessing = true;
    }

    preProcess() {}
    async doProcess(text) {}
    postProcess() {}

    async process(text) {
        this.preProcess();
        try {
            var results = await this.doProcess(text);
            this.postProcess();    
            return results;
        } catch (error) {
            console.error(error);
        }        
    }          
}