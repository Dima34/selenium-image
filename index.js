const {By,Key,Builder} = require("selenium-webdriver");
const path = require('path');
const chrome = require('selenium-webdriver/chrome');
const widthArray = [320, 360, 375, 414, 428, 768, 1024, 1280, 1366, 1440, 1536, 1920]

// image searching and browser resize functionality
module.exports = async (inputPath)=>{
    const layoutPath = path.resolve(inputPath);
    
    try {
        let results = [] 
        for (let widthValue of widthArray) {
            let imageValues = new Set()
            let screen = {width: widthValue,height: 480};
            
            let driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(new chrome.Options().headless().windowSize(screen))
                .build();
        
            await driver.get(layoutPath);
        
            let images = await driver.findElements(By.tagName('img'))
            console.log(`array length - `, images.length);

            for await (let el of images) {
                let rect = await el.getRect()
                // as i understood, 34 is a scroll line width
                imageValues.add(rect.width+34);
            }
        
            await driver.quit()
            results.push({widths:imageValues})
        }

        return results
    }
    catch(err) {
        console.log(err); // TypeError: failed to fetch
    }
}

