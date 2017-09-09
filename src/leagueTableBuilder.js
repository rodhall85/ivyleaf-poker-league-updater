module.exports = {
  build: build
};

function build(league) {

  const leagueDates = getLeagueDates();

  let rows = '';
  let headerRowContent = '<span class="cell">&nbsp;</span>';
  leagueDates.map(date => {
    headerRowContent += `<span class="cell">${date}</span>`;
  });
  headerRowContent += '<span class="cell">Total</span>';
  rows += `<div class="header-row"><div class="dates">${headerRowContent}</div></div>`;

  league.map(entry => {
    let results = '';
    results += `<span class="cell player-name">${entry.player}</span>`;
    leagueDates.map(date => {
      let points = '';
      entry.results.map(result => {
        if (result.date === date) {
          points = result.points;
        }
      });

      results += `<span class="cell player-points">${points}</span>`;
    });

    results += `<span class="cell player-points-total">${entry.points}</span>`;
    rows += `<div class="player-results-row">${results}</div>`;
  });

  let leagueTable = `<div class="league-table">${rows}</div>`;
  let head = '<head><link rel="stylesheet" href="style.css"></head>';
  let body = `<body>${leagueTable}</body>`;
  let html = `<html>${head}${body}</html>`;

  return html;

  function getLeagueDates() {
    const allLeagueDates = league.map(entry =>
      entry.results.map(result =>
        result.date
      )
    );
    const mergedLeagueDates = allLeagueDates.reduce((a,b) =>
      a.concat(b)
    );
    const uniqueLeagueDates = [...new Set(mergedLeagueDates)];

    return uniqueLeagueDates.sort();
  }
}
