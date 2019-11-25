var fs = require('fs');

module.exports = function cleanDir() {
    fs.readdir('./public/downloads/', (err, files) => {
        files.forEach(file => {
            console.log(file);
            fs.unlinkSync('./public/downloads/' + file);
        });
        console.log('clean');
    });
}