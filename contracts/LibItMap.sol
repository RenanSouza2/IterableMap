// SPDX-License-Identifier: ULICENSED
pragma solidity ^0.8.0;

struct ItMap {
    address[] array;
    mapping (address => uint) map;
}

library LibItMap {
    function insertAddress(ItMap storage itMap, address _address)
    internal {
        require(itMap.map[_address] == 0, "Address already inserted");
        itMap.array.push(_address);
        itMap.map[_address] = itMap.array.length;
    }

    function removeAddress(ItMap storage itMap, address _address)
    internal {
        uint index = itMap.map[_address];
        require(index != 0, "Address not inserted");
        
        if(index != itMap.array.length) {
            address last = itMap.array[itMap.array.length - 1];
            itMap.array[index - 1] = last;
            itMap.map[last] = index;
        }

        itMap.map[_address] = 0;
        itMap.array.pop();
    }

    function replaceAddress(
        ItMap storage itMap, 
        address oldAddress, 
        address newAddress
    ) internal {
        uint index = itMap.map[oldAddress];
        require(index != 0, 'Address nor inserted');
        require(itMap.map[newAddress] == 0, 'Address already inserted');
        itMap.map[oldAddress] = 0;
        itMap.map[newAddress] = index;
        itMap.array[index - 1] = newAddress;
    }

    function isIncluded(ItMap storage itMap, address _address)
    internal view returns(bool) {
        return itMap.map[_address] != 0;
    }

    function getAll(ItMap storage itMap)
    internal view returns (address[] memory) {
        return itMap.array;
    }

    function getCount(ItMap storage itMap)
    internal view returns (uint) {
        return itMap.array.length;
    }
}
