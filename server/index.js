const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const API_KEY = require('../key.config');
const items = require('../database');
const { query } = require('express');

const app = express();

app.use(express.static(__dirname + '/../client/dist'));

app.get('/items', function (req, res) {
  items.selectAll(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.get('/search/:keyword', async (req, res) => {
  const { keyword } = req.params;
  const q = await axios.get(`http://newsapi.org/v2/top-headlines?country=us&category=${keyword}&apiKey=${API_KEY}
  `)
  .then((query) => query)
  .catch((err) => console.error(err))
  res.send(JSON.stringify(q.data))
})

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

