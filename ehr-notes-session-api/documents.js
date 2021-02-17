import fetch from "node-fetch";
import {Document} from "./classes/Document.js";

const documents = [];
const url = "https://raw.githubusercontent.com/bjornna/healthontologies/master/syntheticData/linn/documents.json";
    
const response = await fetch(url);
const data = await response.json();

if (data && data.length > 0)
{
    var i = 0;
    data.forEach(document => {
        
        documents.push(
            new Document(
                i,
                document.title,
                document.date,
                document.author,
                document.content
            ));    
        i++;
    });
}

/*data.documents.forEach(document => {
    documents.push(document);    
});*/

        
export default documents;    