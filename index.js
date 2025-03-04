const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require('slugify')
const replaceTemplate = require("./modules/replaceTemplate")
//FILE
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// // console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \n Created on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log("File added");

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1)=> {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2)=> {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3)=> {
//             console.log(data3);

//         fs.writeFile('./txt/joined.txt', `${data2} \n ${data3}`, 'utf-8', err=>{
//             console.log("File successfully added🤗");
//         })
//         })
//     })
// })

//SERVER
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}))
console.log(slugs);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true) 

  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {"content-type": "text/html"})

    const cardsHTML = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML)
    res.end(output);

    //Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, {"content-type": "text/html"})
    const product = dataObj[query.id]
    const output = replaceTemplate(tempProduct, product)
    res.end(output);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);

    //Not Found Page
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "Hello Duniya",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "localhost", () => {
  console.log("Listening to requests on port 8000");
});
