const fs = require("fs-extra");
const path = require('path');
const source = './src'
const destination = './_dest'

module.exports = (source, destination)=>{
    // copy source folder to destination
    fs.copySync(source, destination);

    return path.resolve(destination)
}
