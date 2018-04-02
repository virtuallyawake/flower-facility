var debug = require('debug')('bloomon:flower');

function validate(flower) {
  var VALID_FLOWER = /^[a-z][S|L]$/;
  var isValid = VALID_FLOWER.test(flower);

  if (!isValid) {
    debug('Flower is not valid: ' + flower);
    return false;
  }

  return true;
}

function parseFlowerWithRegex(flower) {
  return {
    type : flower.charAt(0),
    size : flower.charAt(1)
  };
}

function parseFlower(flower) {
  if (!validate(flower))
    return false;

  return parseFlowerWithRegex(flower);
}

module.exports = {
  parse: parseFlower
}
