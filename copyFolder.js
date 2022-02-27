const fs = require("fs-extra");
const path = require('path');
const source = './src'
const destination = './_dest'

module.exports = ()=>{
    // copy source folder to destination
    fs.copy(source, destination);

    return path.resolve(destination)
}
