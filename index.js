require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let urlList = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  //console.log();
  let url = req.body.url;
  //console.log(url);
  //console.log(isValidUrl(url));
  if (isValidUrl(url)) {
    let index = urlList.findIndex((x) => x == url);
    if (index < 0) {
      urlList.push(url);
    }
    index = urlList.findIndex((x) => x == url);
    res.json({ original_url: url, short_url: index + 1 });
  } else {
    res.json({ error: 'invalid url' });
  }
});

const isValidUrl = (urlString) => {
  let url;
  try {
    url = new URL(urlString);
  } catch (e) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};

// const isValidUrl = (urlString) => {
//   try {
//     return Boolean(new URL(urlString));
//   } catch (e) {
//     return false;
//   }
// };

// const isValidUrl = (urlString) => {
//   var urlPattern = new RegExp(
//     '^(https?:\\/\\/)?' + // validate protocol
//       '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
//       '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
//       '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
//       '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
//       '(\\#[-a-z\\d_]*)?$',
//     'i'
//   ); // validate fragment locator
//   return !!urlPattern.test(urlString);
// };

app.get('/api/shorturl/:id', function (req, res) {
  console.log(req.params.id);
  let url = urlList[req.params.id - 1];
  res.redirect(url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
