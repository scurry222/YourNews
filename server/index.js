const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const API_KEY = require('../key.config');
const { selectOneUser, addUserTags } = require('../database');
const { query } = require('express');
const { currentDateFormatted } = require('./utils');


const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/../client/dist'));


app.get('/api/popular', async (req, res) => {
  console.log('connected')
  await axios.get(`http://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`)
  .then((query) => res.send(query.data))
  .catch((err) => console.error(err));
})

app.get('/api/search/:keyword', async (req, res) => {
  const { keyword } = req.params;
  const date = currentDateFormatted();
  await axios.get(`http://newsapi.org/v2/everything?language=en&q=${keyword}&from=${date}&sortBy=publishedAt&apiKey=${API_KEY}
  `)
  .then((query) => res.send(query.data))
  .catch((err) => console.error(err));
})

app.get('/api/getUser', async(req, res) => {
  const { user, password } = req.body;
  await selectOneUser(user, password, (user) => res.send(user))
})

app.post('/api/userTags', async(req, res) => {
  const { username, password, tags } = req.body;
  await addUserTags(username, password, tags, () => res.send());
})

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

