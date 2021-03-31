import Delta from "quill-delta";

export class Session {
    #otDelta;
    #deltas;

    constructor(id, delta, user) {    
        console.log(id, delta, user);    
        this.id = id;
        this.#otDelta = new Delta(JSON.parse(delta));                        
        this.#deltas = [];
        this.users = [user];
    }

    delta = () => {
        return JSON.stringify(this.#otDelta);
    }

    addUser(user) {
        this.users.push(user);
    }

    removeUser(user) {
        var index = this.users.indexOf(user);
        if (index >= 0) {
            this.users.splice(index, 1);
        }        
    }

    hasMultipleUsers() {
        return this.users.length > 1;
    }
}