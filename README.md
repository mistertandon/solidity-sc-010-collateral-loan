### Collateral smart contract
 > git clone https://<PAT>@github.com/username/repo.git

#### How to compile ParveshToken.sol and CollateralizedLoan.sol
 > npx hardhat compile

#### How to run test cases
> npx hardhat test

#### How to deploy ParveshToken.sol and CollateralizedLoan.sol
> npx hardhat run scripts/deploy.js --network sepolia-testnet

and configure package.json

```
   "scripts": {
    "compile": "hardhat compile",
    "deploy:test:sepolia": "hardhat run --network sepolia-testnet scripts/deploy.js"
  }
```

 and hardhat.config.js file accordingly
```
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    "sepolia-testnet": {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY].filter(Boolean),
    },
  }
};
```
Sepolia testnet address for Parvesh and CollateralizedLoan

> Parvesh address: 0xCEA62A3D145A65dD1f15C49395DC7e32833fd6Bb [Link](https://sepolia.etherscan.io/address/0xCEA62A3D145A65dD1f15C49395DC7e32833fd6Bb)

> CollateralizedLoan address: 0xc7EC3Fd9d1F90E75e773Db2419155a3cca3F173c [Link](https://sepolia.etherscan.io/address/0xc7EC3Fd9d1F90E75e773Db2419155a3cca3F173c)