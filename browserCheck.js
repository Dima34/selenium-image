const {By,Key,Builder} = require("selenium-webdriver");
const path = require('path');
const chrome = require('selenium-webdriver/chrome');
const widthArray = [320, 360, 375, 414, 428, 768, 1024, 1280, 1366, 1440, 1536, 1920]

// image searching and browser resize functionality
module.exports = async (inputPath, pictureObj)=>{
    const layoutPath = path.resolve(inputPath);
    
    try {
        for (let widthValue of widthArray) {
            let screen = {width: widthValue,height: 980};
            
            let driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(new chrome.Options().headless().windowSize(screen))
                .build();
        
            await driver.get(layoutPath);
        
            let images = await driver.findElements(By.tagName('img'))

            for await (let el of images) {
                let imageId = await el.getAttribute("data-domchangerid")
                if(imageId != undefined){
                    // If an object hasn`t a src of image - add it
                    let obj = pictureObj[imageId]

                    // add width values to image info
                    await el.getRect().then(rect=>obj.widths.add(rect.width))
                }                
            }
        
            await driver.quit()
        }

        return pictureObj
    }
    catch(err) {
        console.log(err); // TypeError: failed to fetch
    }
}

