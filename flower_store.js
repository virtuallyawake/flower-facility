var debug = require('debug')('bloomon:flower_store');
var bouquetModel = require('./bouquet');
var flowerModel = require('./flower');
var flowers = {};
var bouquets = {};
var FLOWERS_LIMIT = 256;

// Store new flower with flowers of the same size and type
function addToFlowers(flower) {
  if (!flowers[flower.size]) {
    flowers[flower.size] = {};
    flowers[flower.size]['total'] = 0;    
  }

  if (!flowers[flower.size][flower.type])
    flowers[flower.size][flower.type] = 0;

  flowers[flower.size][flower.type]++;
  flowers[flower.size]['total']++;
  return flowers;
}

function clearFlowers() {
  flowers = {};
}

function clearBouquets() {
  bouquets = {};
}

function checkIfEnoughFlowers(bouquet, availableFlowers) {
  if (bouquet.total > availableFlowers.total)
    return false;

  var flowerAvailability = bouquet.flowers.map(function (bFlower) {
    return !availableFlowers[bFlower.type] ? false : 
      availableFlowers[bFlower.type] >= bFlower.qty;
  });

  return flowerAvailability.reduce(function (acc, curr) {
    return acc && curr;
  });
}

function addExtraFlowers(newBouquet, availableFlowers, type, num) {
  var oldTotal = newBouquet.total;
  newBouquet.flowers.forEach(function (flower) {
    if (flower.type === type) {
      flower.qty += num;
      newBouquet.total += num;
    }
  });

  if (newBouquet.total === oldTotal) { // we haven't added flowers yet
    newBouquet.flowers.push({type: type, qty: num});
    newBouquet.total += num;    
  }
  availableFlowers[type] -= num;
  availableFlowers['total'] -= num;
}

function createBouquet(bouquet, availableFlowers) {
  debug("Design rule: " + bouquet.rule);
  debug("Flowers (%s) before bouquet", bouquet.size);
  debug(availableFlowers);
  // We create a new bouquet based on the design rule
  var newBouquet = bouquetModel.parseBouquet(bouquet.rule);

  var bouquetRequired = 0;
  bouquet.flowers.forEach(function (bFlower) {
    availableFlowers[bFlower.type] -= bFlower.qty;
    availableFlowers.total -= bFlower.qty;
    bouquetRequired += bFlower.qty;
  });
  newBouquet.total = bouquetRequired;

  var totalExtra = bouquet.total - bouquetRequired;
  var availableFlowerTypes = Object.keys(availableFlowers);
  availableFlowerTypes.forEach(function (type) {
    if (type === 'total')
      return;

    if (totalExtra === 0)
      return;

    if (availableFlowers[type] >= totalExtra) {
      addExtraFlowers(newBouquet, availableFlowers, type, totalExtra)
      totalExtra = 0;
    } else {
      if (availableFlowers[type] > 0) {
	addExtraFlowers(newBouquet, availableFlowers, type, availableFlowers[type]);
	totalExtra -= availableFlowers[type];
      }
    }
  });
  debug("Flowers (%s) after bouquet", bouquet.size);
  debug(availableFlowers);

  return newBouquet;
}

// Checks if there are enough flowers for the bouquet
// Returns the new bouquet if enough flowers. Otherwise, false
function checkIfReady(bouquet) {
  var availableFlowers = flowers[bouquet.size];
  var isEnough = checkIfEnoughFlowers(bouquet, availableFlowers);
  if (isEnough)
    return createBouquet(bouquet, availableFlowers);

  return false;
}

// Iterate through the bouquet designs available and return
// new bouquet if if can be assembled with available flowers
function checkForBouquet(size) {
  for(var i=0; i<bouquets[size].length; i++) {
    var bouquet = checkIfReady(bouquets[size][i]);
    if (bouquet)
      return bouquet;
  }
}

function processFlower (flower) {
  var flower = flowerModel.parse(flower);

  if (!flower)  // flower did not pass validation
    return;

  addToFlowers(flower);

  // EXTRA TASK: exiting if maximum number of flowers is exceeded
  var totalFlowers = Object.keys(flowers).map(function (flowerSize) {
    return flowers[flowerSize].total;
  }).reduce(function (acc, curr) {
    return acc + curr;
  }, 0);
  debug('Total number of flowers: ' + totalFlowers);

  if (totalFlowers > FLOWERS_LIMIT) {
    console.log('Maximum number of flowers exceeded');
    process.exit(1);
  }

  return checkForBouquet(flower.size);
}

function processDesignRule (rule) {
  var bouquet = bouquetModel.parseBouquet(rule);

  if (!bouquet)  // rule did not pass validation
    return;

  if (!bouquets[bouquet.size]) {
    bouquets[bouquet.size] = [];
  }
  bouquets[bouquet.size].push(bouquet);
  return bouquets;
}

module.exports = {
  processFlower: processFlower,
  processDesignRule: processDesignRule,
  addToFlowers: addToFlowers,
  clearFlowers: clearFlowers,
  clearBouquets: clearBouquets
};
