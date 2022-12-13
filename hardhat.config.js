require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    ganache: {
      url: "http://localhost:8545",
      accounts: [ '0xed1af5aec56bf0f8d81a4664c89e4d0bc9354061c40899ec03992372c3b8d11f' ]
    }
  }
};
