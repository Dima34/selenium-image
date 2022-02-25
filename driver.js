const index = require("./index")
const domChanger = require("./domChanger")
const path = "./src/index.html";
const filename = "index";

const newFilepath = domChanger(path, filename);
console.log(newFilepath);
// (async () => { console.log(await index.call(this,newFilepath)); })();