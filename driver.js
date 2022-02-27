const copyFolder = require("./copyFolder")
const index = require("./index")
const domChanger = require("./domChanger")
const glob = require("glob")


const destination = copyFolder()
const htmlFilesArr = glob.sync(destination + '/**/*.html')

let path = htmlFilesArr[0]
const pictureObj = domChanger(path);

console.log(pictureObj);

// TODO: make a full folder copy and manually input path of html file which we need to change
// (async () => { 
//     await index.call(this,newFilepath.filePath, newFilepath.pictureObj)
// })();