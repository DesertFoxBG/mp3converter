var req = require('request');

req.post('https://www.expertsphp.com/download.php', { 'url': 'https://m.tiktok.com/v/6761774363306986758.html' }, (httpResponse, body) => {
//console.log(httpResponse);  
console.log(body);
});