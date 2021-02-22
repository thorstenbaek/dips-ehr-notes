export default class Document {
    constructor(id, title, date, author, markdown, session)
    {
        this.id = id;
        this.title = title;
        this.data = date;
        this.author = author;
        this.markdown = markdown;
        this.session = session;
    } 

    setSession(session)
    {
        this.session = session;
    }
}