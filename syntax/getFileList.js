const testFolder = './data';
const fs = require('fs');

fs.readdir(testFolder, (e, fileList) => {
    console.log(fileList);
});
