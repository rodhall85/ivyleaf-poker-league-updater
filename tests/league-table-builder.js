const chai = require('chai');
const expect = chai.expect;
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const xhr = new XMLHttpRequest();

describe('League table builder', () => {
  const league = require('./resources/exampleLeague');
  let expectedLeagueTable;
  let leagueTableBuilder;

  beforeEach(() => {
    xhr.open('GET', `file://${__dirname}/resources/exampleHtml.html`, false);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 || xhr.status == 0) {
        expectedLeagueTable = xhr.responseText.replace('\n','');
      }
    };
    xhr.send();

    leagueTableBuilder = require('../src/leagueTableBuilder');
  });

  it('should build the HTML table', () => {
    const table = leagueTableBuilder.build(league);
    expect(table).to.equal(expectedLeagueTable);
  });
});
