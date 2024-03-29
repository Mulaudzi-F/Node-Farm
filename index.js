const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

const slugify = require("slugify");

//--------------------------------------------SERVER--------------------------------------------------------------//

//this codes get executed once
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
//this codes get executed each time the request has been made
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //--------------------------------OVERVIEW PAGE----------------------------------------------------------//
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    //-----------------------------------------PRODUCT PAGE-------------------------------------------//
  } else if (pathname === "/product") {
    const product = dataObj[query.id];

    res.writeHead(404, {
      "Content-type": "text/html",
    });

    const output = replaceTemplate(tempProduct, product);

    res.end(output);
    //--------------------reading data from the file with an api-----------------------------------//
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    //-------------------------------------------Page not found-------------------------------------//
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "Hello World",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
