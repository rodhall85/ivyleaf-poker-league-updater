const express = require('express');
const app = express();
const leagueJsonBuilder = require('./leagueJsonBuilder');
const leagueTableBuilder = require('./leagueTableBuilder');
const examplePosts = require('../tests/resources/examplePosts');
const urlencode = require('urlencode');
const request = require('request');

const getPosts = (done) => {
  const url = 'https://graph.facebook.com/v2.10/1529096207393950/feed';
  const limit = 1000;
  const accessToken = '$ACCESS_TOKEN';
  const options = {
    url: `${url}?limit=${limit}&access_token=${accessToken}`,
  };
  const callback = (error, response) => {
    console.log('error', response);
    if (!error && response.statusCode == 200) {
      done(JSON.parse(response.body).data.filter(post => post.updated_time > '2017-01-01'));
    }
  };

  request(options, callback);
};

app.post('/buildLeague', (req, res) => {
  getPosts((posts) => {
    const results = leagueJsonBuilder.build(posts);
    //console.log('RESULTS', results);
    const table = leagueTableBuilder.build(results);
    console.log(table);
    const html = urlencode(table);
    const apiKey = '<$API_KEY>'; //TODO: REMOVE!
    const callback = (error, response, body) => {
      console.log('error', error, body);
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    };
    const options = {
      url: 'http://api.page2images.com/html2image',
      method: 'POST',
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: `p2i_html=${html}&p2i_key=${apiKey}`,
    };

    request(options, callback);
  });
});

app.listen(3002, function () {
  console.log('Listening on port 3002!');
});
