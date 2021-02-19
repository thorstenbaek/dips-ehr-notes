export class Session {
    constructor(documentId, deltas) {
        this.documentId = documentId;
        if (deltas == null) {
            this.deltas = []
        }
        else {
            this.deltas = deltas;
        }
    }

    addDeltas(deltas)
    {
        this.deltas.push(...deltas);
    }
}

export class Delta {
   constructor(content, start, stop) {
       this.content = content;
       this.start = start;
       this.stop = stop;
   }    
}

