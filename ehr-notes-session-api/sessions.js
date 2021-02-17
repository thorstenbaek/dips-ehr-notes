import fetch from "node-fetch";

/*const documents = [];
const url = "https://raw.githubusercontent.com/bjornna/healthontologies/master/syntheticData/linn/documents.json";
    
const response = await fetch(url);
const data = await response.json();

if (data && data.length > 0)
{
    data.forEach(document => {
        documents.push(new Document());    
    });
}*/

/*data.documents.forEach(document => {
    documents.push(document);    
});*/



const sessions = [
    {
      "id": 3,
      "title": "Daglig notat",
      "deltas": [
          {"content": "At et magnam iusto reiciendis eaque nesciunt." },
          {"content": "Et aut exercitationem et laborum enim consequatur minima cum quo. Sed accusamus atque veritatis nisi error voluptatibus suscipit. Voluptatum omnis pariatur ducimus. Nisi dolor placeat sunt repellat. Nam ad officia debitis qui non. Quia quo consequatur voluptatibus voluptas molestias."},
          {"content": "Saepe eum totam ipsum ipsum praesentium porro amet.\nNumquam at et rerum iusto voluptas."}]      
    },
    {
        "id": 6,
        "title": "Innkallingsbrev",
        "deltas": [
            {"content": "Omnis nulla tenetur exercitationem exercitationem." },
            {"content": "Iure ratione aut a exercitationem nam magnam labore eveniet magnam. Laborum excepturi explicabo atque saepe voluptates cum aut error. Vitae est est modi facilis. Omnis qui tempore. Et ut rerum ullam ducimus veniam."}]      
    },
    {
        "id": 7,
        "title": "Epikrise",
        "deltas": [
            {"content": "Eum est facilis tempore aut velit." },
            {"content": "Saepe nulla ex qui tempora iure impedit voluptas. Nemo ullam qui et rerum. Dolor doloremque aliquam rerum numquam labore. Sint quas sit fugit quaerat similique sunt."},
            {"content": "Commodi eius vel deserunt aut omnis ipsam dignissimos. Debitis est facilis earum et consectetur in. Consequatur fugiat sed. Et hic pariatur dolorum est. Asperiores voluptas laborum quas laboriosam odit aut et sapiente sint."},
            {"content": "Similique cum eligendi porro nihil."}]      
    }];
        
export default sessions;    