const Image = require("@11ty/eleventy-img");
const fs = require('fs');
const HTMLParser = require('node-html-parser');

module.exports = (imageObject, destinationFolder, filePath) =>{
    
    (async () => {
        for (const obj in imageObject) {
            let stats = await Image(imageObject[obj].src, {
                widths: [...imageObject[obj].widths],
                outputDir: destinationFolder + "/img/",
                formats: ["png"]
            })
            

            // Create sizes line
            let detailWidths = imageObject[obj].detailWidths
            let detailWidthsKeys = Object.keys(detailWidths)
            let sizes = ""

            detailWidthsKeys.forEach((el, index) => {
                if(index == 0){
                    sizes += `(max-width: ${detailWidths[el].imageWidth}px) ${detailWidths[el].imageWidth}px`
                } else{
                    sizes += `(max-width: ${detailWidths[el].innerWidth}px) ${detailWidths[el].imageWidth}px`
                }

                if(index == detailWidthsKeys.length - 1 ){
                    sizes += `,(min-width: ${detailWidths[el].innerWidth}px) ${detailWidths[el].imageWidth}px`
                }
                
                if(index <detailWidthsKeys.length - 1 ){
                    sizes += ", "
                }

                
            });

            // Create src line and create a picture tag

            let pictureTag = "<picture>"
            for (const key in stats) {
                pictureTag += `<source sizes="${sizes}" type="${stats[key][0].sourceType}" srcset="`

                stats[key].forEach(el=>{
                    pictureTag += el.srcset.slice(1) + ","
                })

                pictureTag= pictureTag.slice(0,-1)

                pictureTag += `">`
            }
            pictureTag += `<img src = "${imageObject[obj].src.split("/").slice(2).join("/")}"></picture>`
            
            imageObject[obj].pictureTag = pictureTag
        }

        const textContent = fs.readFileSync(filePath, 'utf8')
        const root = HTMLParser.parse(textContent); 
        const imageArray = root.querySelectorAll("img")

        imageArray.forEach(imageEl=>{
            let id = imageEl.getAttribute("data-domchangerid")
            pictureTag = HTMLParser.parse(imageObject[id].pictureTag)
            imageEl.replaceWith(pictureTag)
        })

        fs.writeFileSync(filePath, root.innerHTML, function (err) {
            if (err) return console.log(err);
        });

    })();
}