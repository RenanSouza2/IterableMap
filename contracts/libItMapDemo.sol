// SPDX-License-Identifier: ULICENSED
pragma solidity ^0.8.0;

import './LibItMap.sol';

contract LibItMapDemo {
    using LibItMap for ItMap;

    ItMap itMap;

    // hot it is suposed to be used

    function insert(address _address)
    external {
        itMap.insertAddress(_address);
    }

    function remove(address _address)
    external {
        itMap.removeAddress(_address);
    }
    
    function isInserted(address _address)
    external view returns (bool) {
        return itMap.isInserted(_address);
    }

    function getCount()
    external view returns (uint) {
        return itMap.getCount();
    }

    // for testing purposes

    function getMap(address _address)
    external view returns (uint) {
        return itMap.map[_address];
    }

    function getArray(uint index)
    external view returns (address) {
        return itMap.array[index];
    }

    function getAll()
    external view returns (address[] memory) {
        return itMap.array;
    }
}
