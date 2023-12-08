#!/bin/bash
cd ./test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
