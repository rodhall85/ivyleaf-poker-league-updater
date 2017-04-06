const chai = require('chai');
const expect = chai.expect;

let posts = require('./resources/examplePosts');

describe('league builder', () => {
  let leagueBuilder;

  beforeEach(() => {
    leagueBuilder = require('../src/leagueBuilder');
  });

  describe('get results', () => {
    let league;
    const expectedLeague = require('./resources/expectedLeague');

    it('should build the results json', () => {
      league = leagueBuilder.build(posts);
      expect(league).to.deep.equal(expectedLeague);
    });

    it('should manage player aliases', () => {
      posts[0].message = '1st Daz 2nd Bonita 3rd Rodders';
      league = leagueBuilder.build(posts);
      expect(league).to.deep.equal(expectedLeague);
    });

    it('should handle backwards positions', () => {
      posts[0].message = 'Daryl 1st Bonnie 2nd Rod 3rd';
      league = leagueBuilder.build(posts);
      expect(league).to.deep.equal(expectedLeague);
    });
  });

  it('should pass', () => {
    expect(1).to.equal(1);
  });

});
