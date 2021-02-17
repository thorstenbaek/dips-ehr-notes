export class Document {
    constructor(id, title, date, author, markdown, hasSession) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.author = author;
        this.markdown = markdown;
        this.hasSession = hasSession;
    }
}