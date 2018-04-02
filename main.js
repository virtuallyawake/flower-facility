var flowerStore = require('./flower_store');
var bouquetModel = require('./bouquet');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', function (line) {
  if (line.trim().length === 2) { // a flower
    var bouquet = flowerStore.processFlower(line);
    if (bouquet) { // we produced a new bouquet
      console.log(bouquetModel.toString(bouquet));
    }
  }

  if (line.trim().length > 2) { // a bouquet design rule
    flowerStore.processDesignRule(line);
  }
});
