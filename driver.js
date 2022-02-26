const index = require("./index")
const domChanger = require("./domChanger")
const path = "./src/index.html";
const filename = "index";

const newFilepath = domChanger(path, filename);

(async () => { 
    await index.call(this,newFilepath.filePath, newFilepath.pictureObj)
})();