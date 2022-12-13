# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

# IterableMap

This is a data struct proposal to manage a set of addressess

## Introduction

The data structure is created on the following basis:
* Constant complex time add
* Constant complex time remove
* Constant complex time verification of address inclusion
* Linear time pagination of all addressess 

## description

The struct consists of twi items, an array of adressess and an map from address to numbers. The array holds all the included addressess, the map holds the index of the address plus 1.

To verify if an address is included it is only necessary to check if the map associates the given address to a number different than zero, that's why you add 1 to the index.

To include an array is is pushed to the last position of the array and the correct number is regfisteded in the map.

To remove an address it is only needed to give the address because the index is retriavable in the map. Thats why not use a simple map from address to bool. If the address is in the last position it just pops the last position and updates the map. Other cases it is needed to relocate the last address to the position being deleted and all alterations updated in the map.

## Comparison between existent structure and proposed onde

