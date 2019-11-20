var fs = require('fs');

module.exports = function cleanDir() {
    fs.readdir('./downloads/', (err, files) => {
        files.forEach(file => {
            console.log(file);
            fs.unlinkSync('./downloads/' + file);
        });
        console.log('clean');
    });
}