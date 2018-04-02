var debug = require('debug')('bloomon:design_rule');
var util = require('util');

function parseFlower(flower) {
  return {
    type : flower.slice(-1),
    qty : parseInt(flower.slice(0, flower.length-1))
  };
}

function parseBouquet(rule) {
  if (!validate(rule))
    return false;

  return parseBouquetWithRegex(rule);
}

function parseBouquetWithRegex(rule) {
  var BOUQUET_NAME = /^[A-Z]/;
  var BOUQUET_SIZE = /^[A-Z]([L|S])/;
  var FLOWERS = /\d+[a-z]/g;
  var TOTAL = /\d+$/

  return {
    rule: rule,
    type: rule.match(BOUQUET_NAME)[0],
    size: rule.match(BOUQUET_SIZE)[1],
    flowers: rule.match(FLOWERS).map(parseFlower),
    total: parseInt(rule.match(TOTAL)[0])
  };
}

function validate(rule) {
  var VALID_BOUQUET = /^[A-Z][L|S](\d+[a-z])+\d+$/;
  var isValid = VALID_BOUQUET.test(rule);
  
  if (!isValid) {
    debug('Rule is not valid: ' + rule);
    return false;
  }

  if (isValid) {
    var bouquet = parseBouquetWithRegex(rule);
    var totalRequired = bouquet.flowers.reduce(function (acc, curr) {
      return acc + curr.qty;
    }, 0)
    if (totalRequired > bouquet.total) {
      debug('Sum of flowers is more than total: ' + rule);
      return false;
    }
  }

  return true;
}

function toString(bouquet) {
  var allFlowers = bouquet.flowers.map(function (flower) {
    return flower.qty + flower.type;
  });
  return util.format('%s%s%s', bouquet.type, bouquet.size, allFlowers.join(''));
}

module.exports = {
  parseBouquet: parseBouquet,
  toString: toString
};
