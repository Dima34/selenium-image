const glob = require("glob")
const Image = require("@11ty/eleventy-img");
const fs = require('fs');
const HTMLParser = require('node-html-parser');
const fsExtra = require("fs-extra");
const path = require('path');
const {By,Key,Builder} = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');


// const widthArray = [320, 360, 375, 414, 428, 768, 1024, 1280, 1366, 1440, 1536, 1920]
const widthArray = [320, 1280, 1440, 1920];
const source = './src';
const destination = './_dest';

const newDestination = copyFolderTo(source,destination)
const htmlFilesArr = glob.sync(newDestination + '/**/*.html')



async function main(){
	for (const filePathItem of htmlFilesArr) {
		console.log(`checking filepath - `, filePathItem);
		const pictureObj = setImageId(filePathItem,destination);

		await browserCheck.call(this,filePathItem, pictureObj)
			.then(filledObj => createPictureTag(filledObj)
				.then(imageObject => replaceImages(filePathItem, imageObject)))
	}	
}

main()

// image searching and browser resize functionality
async function browserCheck(inputPath, pictureObj){
	const layoutPath = path.resolve(inputPath);
	
	try {
		for (let widthValue of widthArray) {
			let screen = {width: widthValue + 34,height: 980};
			
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
					let rect = await el.getRect();
					obj.defaultSize.width = rect.width;
					obj.defaultSize.height = rect.height;
					obj.widths.add(rect.width)
					obj.widths.add(rect.width * 1.5)
					obj.widths.add(rect.width * 2)
					obj.widths.add(rect.width * 3)

					obj.detailWidths[widthValue] = {
						innerWidth : widthValue,
						imageWidth : rect.width,
					}
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

function copyFolderTo(source, destination) {
	// copy source folder to destination
	fsExtra.copySync(source, destination);

	return path.resolve(destination)
}

function setImageId(filePath, folderDest) {
	const textContent = fs.readFileSync(filePath, 'utf8')
	const root = HTMLParser.parse(textContent); 
	const imageArray = root.querySelectorAll("img")

	let pictureObj = {}

	imageArray.forEach(imageEl=>{
		let hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		imageEl.setAttribute("data-domchangerid", hash); 
		pictureObj[hash] = {
			src: folderDest + "/" + imageEl.getAttribute("src"),
			widths: new Set(),
			detailWidths: {},
			defaultSize: {
				width : 0,
				height : 0
			}
		};
	})

	fs.writeFileSync(filePath, root.innerHTML, function (err) {
		if (err) return console.log(err);
	});

	return pictureObj
}

async function makeImage(imageObject) {
	return await Image(imageObject.src, {
		widths: [...imageObject.widths],
		outputDir: destination + "/img/",
		formats: ["webp","png"]
	})
}

async function createPictureTag(imageObjectOld) {
	imageObject = {...imageObjectOld}

	for (const obj in imageObject) {		
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

		let stats = await makeImage(imageObject[obj])

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
		pictureTag += `<img width="${imageObject[obj].defaultSize.width}" height="${imageObject[obj].defaultSize.height}" src = "${imageObject[obj].src.split("/").slice(2).join("/")}"></picture>`
		
		imageObject[obj].pictureTag = pictureTag
	}

	return imageObject
}

function replaceImages(filePath, imageObject) {
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
}