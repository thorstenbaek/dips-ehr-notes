export class Session {
    constructor(id, documentId, user) {
        this.id = id,
        this.documentId = documentId;        
        this.users = [user];
    }

    addUser(user)
    {
        this.users.push(...user);
    }
}