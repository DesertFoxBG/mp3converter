var req = require('request');

var res = req.post('https://ripsave.com/download?video=', { url: '1017' }, (error, cont, body) => {
  console.log(body);
});