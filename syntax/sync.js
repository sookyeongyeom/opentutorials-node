var fs = require('fs');

// readFileSync
console.log('A');
var res = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(res);
console.log('C');

console.log('\n***************************************************\n');

// readFile
console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', (e, res) => {
    console.log(res);
});
console.log('C');
