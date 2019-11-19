var fs = require('fs');

function cleanDir() {
    fs.readdir('./downloads/', (err, files) => {
        files.forEach(file => {
            console.log(file);
            fs.unlinkSync('./downloads/' + file);
        });
        console.log('clean');
    });
}

setInterval(() => {
    cleanDir();
}, 5000);