var express = require('express');
var router = express.Router();

const fs = require('fs')
const youtubedl = require('youtube-dl')
const facebookdl = require('fb-video-downloader');
const http = require('https');
const ytdl = require('ytdl-core');
var ffmpeg = require('ffmpeg');
const { exec } = require('child_process');
var cleaner = require('../cleanDownloads')

function downloadWorking(res, url, format) {
  res.header('Content-Disposition', `attachment; filename="file.${format}"`);

  ytdl(url, {
    format: format
  }).pipe(res);
}

function downloadVideo(format, url, res, req) {
  const video = youtubedl(url,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname })

  // Will be called when the download starts.
  video.on('info', function (info) {
    console.log('Download started')
    console.log('filename: ' + info._filename)
    console.log('format: ' + info.format_id)
    console.log(video);

    let filename = info._filename.replace('.mp4', '.' + format);
    video.pipe(fs.createWriteStream('./downloads/' + filename));

    const stat = fs.statSync('./downloads/' + filename);
    const fileSize = stat.size;
    const range = req.headers.range;
    console.log(range, fileSize);

    //video.pipe(res);

    //res.download('./downloads/' + filename);
  });
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/youtube', function (req, res, next) {
  res.render('youtube');
});

router.get('/ytdownload', async function (req, res, next) {
  var url = req.query.url;
  var format = req.query.format;

  downloadWorking(res, url, format);
  //downloadVideo(format, url, res, req);
});

router.get('/facebook', function (req, res, next) {
  res.render('facebook');
});

router.get('/fbdownload', function (req, res, next) {
  var format = req.query.format;
  var url = req.query.url;

  facebookdl.getInfo(url).then((info) => {
    var title = info.title.replace(/[| !?<>]/g, '');
    var file = fs.createWriteStream('./downloads/' + title + '.' + format);
    var request = http.get(info.download.hd || info.download.sd, function (response) {
      response.pipe(file);

      var readStream = fs.createReadStream('./downloads/' + title + '.' + format);
      readStream.on('data', function (chunk) {
        console.log(chunk); 
      });
      readStream.on('end', function (chunk) {
        res.download('./downloads/' + title + '.' + format, title + '.' + format);
        cleaner();
      });
    });
  });
});

module.exports = router;
