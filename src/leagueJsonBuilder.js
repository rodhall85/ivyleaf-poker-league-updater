const dateformat = require('dateformat');
const util = require('util');
const playerAliases = require('./playerAliases');

module.exports = {
  build: build
};

function build(posts) {
  let league = [];
  posts.forEach(post => {
    parsePost(post);
  });

  calculatePoints();
  sort();

  return league;

  function parsePost(post, backwards) {
    if (!post.message) return;

    const firstIndex = post.message.indexOf('1st');
    const secondIndex = post.message.indexOf('2nd');
    const thirdIndex = post.message.indexOf('3rd');
    const fourthIndex = post.message.indexOf('4th');

    let first, second, third, fourth;
    const messageLength = post.message.length;

    if (firstIndex !== -1)
      first = getPlayerNameFromPost(firstIndex, secondIndex === -1 ? messageLength : secondIndex);
    if (secondIndex !== -1)
      second = getPlayerNameFromPost(secondIndex, thirdIndex === -1 ? messageLength : thirdIndex);
    if (thirdIndex !== -1)
      third = getPlayerNameFromPost(thirdIndex, fourthIndex === -1 ? messageLength : fourthIndex);
    if (fourthIndex !== -1)
      fourth = getPlayerNameFromPost(fourthIndex, messageLength);

    const places = 2 +
      (thirdIndex === -1 ? 0 : 1) +
      (fourthIndex === -1 ? 0 : 1);

    let results = [];
    if (first)
      pushResult(first, places);

    if (second)
      pushResult(second, places - 1);

    if (third)
      pushResult(third, places - 2);

    if (fourth)
      pushResult(fourth, places - 3);

    results.forEach(result => {
      addResultToLeague(result);
    });

    function getPlayerNameFromPost(indexFrom, indexTo) {
      let playerName = post.message.slice(indexFrom + 4, indexTo)
        .trim()
        .split(' ')[0]
        .replace('.', '');

      playerName = capitalizeFirstLetter(playerName);

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
      }

      const aliases = playerAliases.filter(player => {
        return player.aliases.filter(alias => {
          return alias === playerName;
        }).length > 0;
      });

      if (aliases.length > 0) {
        playerName = aliases[0].player;
      }

      return playerName;
    }

    function pushResult(player, points) {
      results.push({
        'player': player,
        'result' : {
          'date': dateformat(post.updated_time, 'yyyy-mm-dd'), 'points': points
        }
      });
    }

    function addResultToLeague(result) {
      const playerEntry = league.filter(entry => {
        return result.player === entry.player;
      });

      if (playerEntry.length === 0) {
        league.push({
          'player': result.player,
          'results': []
        });

        return addResultToLeague(result);
      }

      playerEntry[0].results.push(result.result);
    }

  }

  function calculatePoints() {
    league.map(entry => {
      console.log(entry.results);
      if (entry.results.length > 1) {
        console.log('will calculate');
        entry.points = entry.results.map(result => result.points).reduce((a,b) => {
          return a + b;
        });
      }
      else {
        entry.points = entry.results[0].points;
      }

      return entry;
    });
  }

  function sort() {
    league.sort((a,b) => {
      return b.points - a.points;
    });

    league.forEach((entry, i) => {
      entry.position = i + 1;
    });
  }
}
