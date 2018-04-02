var flowerStore = require('./flower_store');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', function (line) {
  if (line.trim().length === 2) { // a flower
    flowerStore.processFlower(line);
  }

  if (line.trim().length > 2) { // a bouquet design rule
    flowerStore.processDesignRule(line);
  }
});
