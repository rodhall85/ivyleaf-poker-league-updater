const chai = require('chai');
const expect = chai.expect;

describe('league json builder', () => {
  let posts = require('./resources/examplePosts');
  let leagueJsonBuilder;

  beforeEach(() => {
    leagueJsonBuilder = require('../src/leagueJsonBuilder');
  });

  describe('get results', () => {
    let league;
    const expectedLeague = require('./resources/exampleLeague');

    it('should build the results json', () => {
      league = leagueJsonBuilder.build(posts);
      expect(league).to.deep.equal(expectedLeague);
    });

    it('should manage player aliases', () => {
      posts[0].message = '1st Daz 2nd Bonita 3rd Rodders';
      league = leagueJsonBuilder.build(posts);
      expect(league).to.deep.equal(expectedLeague);
    });

    xit('should handle backwards positions', () => {
      posts[0].message = 'Daryl 1st Bonnie 2nd Rod 3rd';
      league = leagueJsonBuilder.build(posts);
      expect(league).to.deep.equal(expectedLeague);
    });

    it('should allow for mixed case on player names', () => {
      posts[0].message = '1st daryl 2nd bonnie 3rd rod';
      league = leagueJsonBuilder.build(posts);
      expect(league).to.deep.equal(expectedLeague);
    });
  });
});
