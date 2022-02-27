const copyFolder = require("./copyFolder")
const browserCheck = require("./browserCheck")
const domChanger = require("./domChanger")
const glob = require("glob")

const source = './src'
const destination = './_dest'

const newDestination = copyFolder(source,destination)
const htmlFilesArr = glob.sync(newDestination + '/**/*.html')

let path = htmlFilesArr[0]
const pictureObj = domChanger(path,destination);

(async () => { 
    let filledObjArray = await browserCheck.call(this,path, pictureObj)
    console.log(filledObjArray);
})();