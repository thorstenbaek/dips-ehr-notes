export class Session {
    constructor(id, document, user) {
        this.id = id,
        this.document = document;        
        this.users = [user];
        this.changes = [];
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