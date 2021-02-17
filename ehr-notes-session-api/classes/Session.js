export class Session {
    constructor(id, deltas) {
        this.id = id;
        this.deltas = deltas;
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

