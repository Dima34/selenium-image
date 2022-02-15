const index = require("./index")
const domChanger = require("./domChanger")
const path = "./edulab/index.html";
const filename = "index";

const newFilepath = domChanger(path, filename);
(async () => { console.log(await index.call(this,newFilepath)); })();