const soundcloudDl = require("./node_modules/soundcloud-dl/index.js");

soundcloudDl.getSongDlByURL("https://m.soundcloud.com/mostafa-p-samir/mgk-swing-life-away").then(function(song){
    console.log(song)
});