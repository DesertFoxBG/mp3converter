'use strict';
 
let tt = require('twitter-dl');
 
let folder = './';
let video = 'https://twitter.com/DierksBentley/status/703222600919588864';
 
tt.download(video, folder).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});