const copyFolder = require("./copyFolder")
const index = require("./index")
const domChanger = require("./domChanger")
const glob = require("glob")

const destination = copyFolder()
const htmlFilesArr = glob.sync(destination + '/**/*.html')

console.log(htmlFilesArr);
let path = htmlFilesArr[0]
console.log(path);

// const newFilepath = domChanger(path);

// TODO: make a full folder copy and manually input path of html file which we need to change
// (async () => { 
//     await index.call(this,newFilepath.filePath, newFilepath.pictureObj)
// })();