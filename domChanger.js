const fs = require('fs');
const HTMLParser = require('node-html-parser');

require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

module.exports = (inputPath, filename)=>{
    const parsedHTML = require(inputPath);
    const root = HTMLParser.parse(parsedHTML); 
    const imageArray = root.querySelectorAll("img")
    let pictureObj = {}

    imageArray.forEach(imageEl=>{
        let hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        imageEl.setAttribute("data-domchangerid", hash); 
        pictureObj[hash] = {
            widths: new Set()
        };
    })

    let dir = './dist';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    let filePath = './dist/'+filename+'.html';

    fs.writeFile(filePath, root.innerHTML, function (err) {
        if (err) return console.log(err);
    });

    return {filePath, pictureObj}
}
