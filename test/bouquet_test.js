var target = require('../bouquet');
var chai = require('chai');
chai.should();

describe('Bouquet test', function () {
  var rule = 'AL10r5t8d30';

  it('should parse valid design rule', function () {
    var bouquet = target.parseBouquet(rule);
    bouquet.should.eql({
      rule: 'AL10r5t8d30',
      type: 'A',
      size: 'L',
      flowers: [
	{ type: 'r', qty: 10 },
	{ type: 't', qty: 5 },
	{ type: 'd', qty: 8 },
      ],
      total: 30
    });
  });

  it('should return false if design rule is not valid (total too low)', function () {
    var ruleWithTooLowTotal = 'AL10r5t8d20';
    var bouquet = target.parseBouquet(ruleWithTooLowTotal);
    bouquet.should.eql(false);    
  });

  it('should return false if design rule is not valid (wrong format)', function () {
    var ruleWithWrongSize = 'AM10r5t8d20';
    var bouquet = target.parseBouquet(ruleWithWrongSize);
    bouquet.should.eql(false);    
  });

  describe('Valid design rules', function () {
    it('should have a bouquet type', function () {
      var bouquet = target.parseBouquet(rule);
      bouquet.type.should.equal('A');
    });
    it('should have a bouquet size', function () {
      var bouquet = target.parseBouquet(rule);
      bouquet.size.should.equal('L');      
    });
    it('should have an array of flowers', function () {
      var bouquet = target.parseBouquet(rule);
      bouquet.flowers.should.be.an('array');      
    });
    it('each flower should have a type and a quantity', function () {
      var bouquet = target.parseBouquet(rule);
      bouquet.flowers.should.eql([ { type: 'r', qty: 10 },
				   { type: 't', qty: 5 },
				   { type: 'd', qty: 8 } ]);
    });
    it('should have a total number of flowers', function () {
      var bouquet = target.parseBouquet(rule);
      bouquet.total.should.equal(30);
    });
  })
});
