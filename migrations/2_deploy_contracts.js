const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");

const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(DaiToken);
  const daiToken =  await DaiToken.deployed();

  await deployer.deploy(DappToken);
  const dappToken =  await DappToken.deployed();

  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  //transfer 1 Million token
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');
  //transfer 10 to account 1
  await daiToken.transfer(accounts[1], '100000000000000000000' )

};
