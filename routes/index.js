var express = require('express');
var router = express.Router();

const fs = require('fs')
const youtubedl = require('youtube-dl')
const facebookdl = require('fb-video-downloader');
const http = require('https');
const ytdl = require('ytdl-core');
var path = require("path");
const { exec } = require('child_process');
var cleaner = require('../cleanDownloads');
var vidl = require('vimeo-downloader');

function downloadWorking(res, url, format) {
  res.header('Content-Disposition', `attachment; filename="youtubeDownload.${format}"`);

  ytdl(url, {
    format: format
  }).pipe(res);
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
    var file = fs.createWriteStream('./public/downloads/' + title + '.' + format);
    var request = http.get(info.download.sd, function (response) {
      response.pipe(file); // for future work

      res.attachment('./public/downloads/' + title + '.' + format);
      response.pipe(res);

      setTimeout(() => {
        cleaner();
      }, 10000);

      //res.download('./public/downloads/' + title + '.' + format);
    });
  });
});

router.get('/vimeo', function (req, res, next) {
  res.render('vimeo');
});

router.get('/vmdownload', function (req, res, next) {
  var format = req.query.format;
  var url = req.query.url;

  res.attachment('./public/downloads/vide.' + format);
  vidl(url, { quality: '360p' })
    .pipe(res);
});

module.exports = router;
