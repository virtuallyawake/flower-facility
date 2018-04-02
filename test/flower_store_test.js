var target = require('../flower_store');
var chai = require('chai');
chai.should();

describe('Flower Store test', function () {
  afterEach(function () {
    target.clearFlowers();
    target.clearBouquets();
  });

  describe('# addToFlowers()', function () {
    it('should add a new small flower to the flowers object', function () {
      var flower = {
	type : 'r',
	size : 'S'
      };
      var flowers = target.addToFlowers(flower);
      flowers.should.eql({ 'S' : { 'r': 1, 'total': 1 }});
    });
    it('should add a new large flower to the flowers object', function () {
      var flower = {
	type : 'd',
	size : 'L'
      };
      var flowers = target.addToFlowers(flower);
      flowers.should.eql({ 'L' : { 'd': 1, 'total': 1 }});
    });
    it('should increase the number of flowers if it already exists', function () {
      var flower = {
	type : 'r',
	size : 'S'
      };
      target.addToFlowers(flower);
      var flowers = target.addToFlowers(flower);
      flowers.should.eql({ 'S' : { 'r': 2, 'total': 2 }});
    });
    it('should store small and large flowers separately', function () {
      var flowerS = {
	type : 'r',
	size : 'S'
      };
      var flowerL = {
	type : 'd',
	size : 'L'
      };
      target.addToFlowers(flowerS);
      var flowers = target.addToFlowers(flowerL);
      flowers.should.eql({
	'S' : { 'r': 1, 'total': 1 },
	'L' : { 'd': 1, 'total': 1 }
      });
    });
  })

  describe('# processDesignRule()', function () {
    it('should add a new small bouquet to the bouquets object', function () {
      var rule = 'AS10r5t8d30';
      var bouquets = target.processDesignRule(rule);
      bouquets.should.have.property('S').but.not.own.property('L'); 
      bouquets['S'].should.be.an('array');
      bouquets['S'].should.have.lengthOf(1);
      bouquets['S'].should.eql([{
	rule: 'AS10r5t8d30',
	type: 'A',
	size: 'S',
	flowers: [
	  { type: 'r', qty: 10 },
	  { type: 't', qty: 5 },
	  { type: 'd', qty: 8 },
	],
	total: 30
      }]);
    });
    it('should add a new large bouquet to the bouquets object', function () {
      var rule = 'AL10r5t8d30';
      var bouquets = target.processDesignRule(rule);
      bouquets.should.have.property('L').but.not.own.property('S'); 
      bouquets['L'].should.be.an('array');
      bouquets['L'].should.have.lengthOf(1);
      bouquets['L'].should.eql([{
	rule: 'AL10r5t8d30',
	type: 'A',
	size: 'L',
	flowers: [
	  { type: 'r', qty: 10 },
	  { type: 't', qty: 5 },
	  { type: 'd', qty: 8 },
	],
	total: 30
      }]);
    });
  })
});
