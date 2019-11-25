var fs = require('fs');
var vidl = require('vimeo-downloader');

vidl(url, { quality: '360p' })
  .pipe(fs.createWriteStream('vide.mp4'));