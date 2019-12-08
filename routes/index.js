var express = require('express');
var router = express.Router();

const fs = require('fs')
const youtubedl = require('youtube-dl')
const facebookdl = require('fb-video-downloader');
const http = require('https');
const ytdl = require('ytdl-core');
var path = require("path");
var cleaner = require('../cleanDownloads');
var vidl = require('vimeo-downloader');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var request = require("request");

function downloadYT(res, url, format) {
  res.header('Content-Disposition', `attachment; filename="youtubeDownload.${format}"`);

  try {
    ytdl(url, {
      format: format
    }).pipe(res);
  }
  catch {
    var request = http.get(url, function (response) {
      res.attachment('video.' + format);
      response.pipe(res);
    });
  }
}

// GET home page.
router.get('/', function (req, res, next) {
  res.render('index');
});

// GET pp page.
router.get('/pp', function (req, res, next) {
  res.render('pp');
});

// GET tos page.
router.get('/tos', function (req, res, next) {
  res.render('tos');
});

router.get('/youtube', function (req, res, next) {
  res.render('youtube', { info: '' });
});

router.get('/ytinfo', function (req, res, next) {
  var url = req.query.url;

  ytdl.getInfo(url, (err, info) => {
    if (err) throw err;
    console.log(info.player_response.streamingData.adaptiveFormats);
    // recommended
    var div_els = `<h1> </h1><form action="/ytdownload"><p style="font-weight: bold;">audio/mp3 | audio <i class="fas fa-check-circle"></i></p><input name="url" value="${url}" style="display: none;"><input name="format" value="mp3" style="display: none;"><input type="submit" value="Download" style="margin: 0; position: relative;"></form>`;
    for (var c = 0; c < info.player_response.streamingData.formats.length; c++) {
      let format = info.player_response.streamingData.formats[c];
      let quality = format.qualityLable;
      // recommended
      div_els += `<form action="/ytdownload"><p style="font-weight: bold;">${format.mimeType.substring(0, format.mimeType.indexOf(';'))} ${quality ? '| ' + format.qualityLable : '| ' + format.quality} <i class="fas fa-check-circle"></i></p><input name="url" value="${format.url}" style="display: none;"><input name="format" value="${format.mimeType.substring(format.mimeType.indexOf('/') + 1, format.mimeType.indexOf(';'))}" style="display: none;"><input type="submit" value="Download" style="margin: 0; position: relative;"></form>`
    }
    for (var c = 0; c < info.player_response.streamingData.adaptiveFormats.length; c++) {
      let format = info.player_response.streamingData.adaptiveFormats[c];
      let quality = format.qualityLable;
      div_els += `<form action="/ytdownload"><p style="font-weight: bold;">${format.mimeType.substring(0, format.mimeType.indexOf(';'))} ${quality ? '| ' + format.qualityLable : '| ' + format.quality}</p><input name="url" value="${format.url}" style="display: none;"><input name="format" value="${format.mimeType.substring(format.mimeType.indexOf('/') + 1, format.mimeType.indexOf(';'))}" style="display: none;"><input type="submit" value="Download" style="margin: 0; position: relative;"></form>`
    }
    div_els += '<h1> </h1>'
    res.render('youtube', { info: div_els });
  });
});

router.get('/ytdownload', async function (req, res, next) {
  var url = req.query.url;
  var format = req.query.format;
  console.log(format);

  downloadYT(res, url, format);
  //downloadVideo(format, url, res, req);
});

router.get('/facebook', function (req, res, next) {
  res.render('facebook', { info: '' });
});

router.get('/fbinfo', function (req, res, next) {
  var url = req.query.url;

  facebookdl.getInfo(url).then((info) => {
    var title = info.title;
    console.log(Object.keys(info.download));
    var div_els = `<h1> </h1>`;
    for(var c = 0; c < Object.keys(info.download).length; c++) {
      var key = Object.keys(info.download)[c];
      console.log(key, info.download[Object.keys(info.download)[c]]);
      if(info.download[Object.keys(info.download)[c]] == undefined) continue;
      div_els += `<form action="/fbdownload"><p style="font-weight: bold;">${title} | Quality: ${key.toLocaleUpperCase()}</p><input name="url" value="${info.download[key]}" style="display: none;"><select name="format"><option value="mp3">MP3</option><option value="mp4">MP4</option></select><input type="submit" value="Download" style="margin: 0; position: relative;"></form>`;
    }
    div_els += '<h1> </h1>'

    res.render('facebook', { info: div_els });
  });
});

router.get('/fbdownload', function (req, res, next) {
  var url = req.query.url;
  var format = req.query.format;
  var file = fs.createWriteStream('./public/downloads/fbvideo.' + format);

  var request = http.get(url, function (response) {
    response.pipe(file); // for future work

    res.attachment('./public/downloads/fbvideo.' + format);
    response.pipe(res);

    setTimeout(() => {
      cleaner();
    }, 10000);

    //res.download('./public/downloads/' + title + '.' + format);
  });
});

router.get('/vimeo', function (req, res, next) {
  res.render('vimeo', { info: '' });
});

router.get('/vminfo', function (req, res, next) {
  var url = req.query.url;

  var div_els = `<h1> </h1><form action="/vmdownload"><p style="font-weight: bold;">Quality: 144p</p><input name="url" value="${url}" style="display: none;"><input name="quality" value="144p" style="display: none;"><select name="format"><option value="mp3">MP3</option><option value="mp4">MP4</option></select><input type="submit" value="Download" style="margin: 0; position: relative;"></form><form action="/vmdownload"><p style="font-weight: bold;">Quality: 360p</p><input name="url" value="${url}" style="display: none;"><input name="quality" value="360p" style="display: none;"><select name="format"><option value="mp3">MP3</option><option value="mp4">MP4</option></select><input type="submit" value="Download" style="margin: 0; position: relative;"></form><form action="/vmdownload"><p style="font-weight: bold;">Quality: 480p</p><input name="url" value="${url}" style="display: none;"><input name="quality" value="480p" style="display: none;"><select name="format"><option value="mp3">MP3</option><option value="mp4">MP4</option></select><input type="submit" value="Download" style="margin: 0; position: relative;"></form><form action="/vmdownload"><p style="font-weight: bold;">Quality: 720p</p><input name="url" value="${url}" style="display: none;"><input name="quality" value="720p" style="display: none;"><select name="format"><option value="mp3">MP3</option><option value="mp4">MP4</option></select><input type="submit" value="Download" style="margin: 0; position: relative;"></form><form action="/vmdownload"><p style="font-weight: bold;">Quality: 1080p</p><input name="url" value="${url}" style="display: none;"><input name="quality" value="1080p" style="display: none;"><select name="format"><option value="mp3">MP3</option><option value="mp4">MP4</option></select><input type="submit" value="Download" style="margin: 0; position: relative;"></form>`;
  div_els += '<h1> </h1>'

  res.render('vimeo', { info: div_els });
});

router.get('/vmdownload', function (req, res, next) { // fix .mp4 format
  var format = req.query.format;
  var url = req.query.url;
  var quality = req.query.quality;

  vidl(url, { format: format, quality: quality })
    .pipe(fs.createWriteStream('./public/downloads/vimeo.' + format));

  res.attachment('./public/downloads/vimeo.' + format);
  console.log('vimeo.' + format, quality);
  vidl(url, { format: format, quality: quality })
    .pipe(res);
});

router.get('/tiktok', function (req, res, next) {
  res.render('tiktok', { info: '' });
});

router.get('/ttinfo', function (req, res, next) {
  var url = req.query.url;

  var div_els = `<h1> </h1><form action="/ttdownload"><p style="font-weight: bold;">720p</p><input name="url" value="${url}" style="display: none;"><select name="format"><option value="mp3">MP3</option><option value="mp4">MP4</option></select><input type="submit" value="Download" style="margin: 0; position: relative;"></form><h1> </h1>`;
  
  res.render('tiktok', { info: div_els });
});

router.get('/ttdownload', function (req, res, next) {
  var format = req.query.format;
  var url = req.query.url;

  var options = {
    method: 'POST',
    url: 'https://www.expertsphp.com/download.php',
    qs: { '': '' },
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: { url: url }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    const dom = new JSDOM(body);
    var video_url = dom.window.document.querySelector('source').getAttribute('src');
    console.log(video_url);

    var request = http.get(video_url, function (response) {
      res.attachment('tiktok.' + format);
      response.pipe(res);
    });
  });
});

module.exports = router;
