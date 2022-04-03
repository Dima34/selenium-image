const fs = require('fs');
const HTMLParser = require('node-html-parser');

module.exports = (filePath, folderDest)=>{
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
			detailWidths: {}
		};
	})

	fs.writeFileSync(filePath, root.innerHTML, function (err) {
		if (err) return console.log(err);
	});

	return pictureObj
}
