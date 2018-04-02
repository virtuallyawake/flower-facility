# Flower Production Facility

This application represents a flower production facility. The input for the application comes through stdin. Each line can be either a new flower or a design rule for a bouquet. As we process each incoming flower, we check whether we have enough flowers for a bouquet. If so, the bouquet is printed to stdout.

If the number of flowers available exceeds the limit (256), the application will exit.

## How to install
```bash
npm install
```

## How to run
```bash
node main.js < test_input.txt
```

## How to run with debug output
```bash
DEBUG=bloomon:* node main.js < test_input.txt
```

## How to run the tests
```bash
npm test
```
