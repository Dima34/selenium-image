const fs = require('fs');
const HTMLParser = require('node-html-parser');

require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

module.exports = (inputPath, filename)=>{
    const parsedHTML = require(inputPath);
    const root = HTMLParser.parse(parsedHTML); 
    const imageArray = root.querySelectorAll("img")
    let pictureArray = []

    imageArray.forEach(imageEl=>{
        let hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        // TODO: Set hash as object name and return empty object
        console.log({[hash]: {}});
        pictureArray.push()
    })

    // fs.writeFile("filename.html", root.html)

    let dir = './dist';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    let filePath = './dist/'+filename+'.html';

    fs.writeFile(filePath, root.innerHTML, function (err) {
        if (err) return console.log(err);
    });

    return {filePath, pictureArray}
}
