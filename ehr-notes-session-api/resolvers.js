var documents = [];

const resolvers = {
    Query: {
        document: (id) => {
            var document = documents.filter(d => d.id == id.id);
            if (document.length == 0) {
                throw new Error(`no document exists with id ${id.id}`);
            }
            return document[0];
          },
        
        documents: () => {
            return documents;
          },    
    },

    Mutation: {

    },

    Subscription: {

    }
}

module.exports = resolvers;