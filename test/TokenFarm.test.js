const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");

const TokenFarm = artifacts.require("TokenFarm");


require('chai')
.use(require('chai-as-promised'))
.should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) =>{

    let daiToken;
    let dappToken;
    let tokenFarm;

    before(async() => {
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

        await dappToken.transfer(tokenFarm.address, tokens('1000000'));

        await daiToken.transfer(investor, tokens('100'), {from: owner});
    });

    describe("Mock Dai Deployment", async() => {
        it('has a name', async() => {
            const name = await daiToken.name();
            name.should.equal("Mock Dai Token");
        });
    })

    describe("Dapp Token Deployment", async() => {
        it('has a name', async() => {
            const name = await dappToken.name();
            name.should.equal("DApp Token");
        });
    })

    describe("Token Farm Deployment", async() => {
        it('has a name', async() => {
            const name = await tokenFarm.name();
            name.should.equal("Dapp Token Farm");
        });

        it('contract has token', async() => {
            let balance = await dappToken.balanceOf(tokenFarm.address);
            balance.toString().should.equal(tokens('1000000'))
        });
    })

    describe("Farming Tokens", async() => {
        it('rewards investory from stacking mDai Tokens', async() => {
            let result;
            
            result = await daiToken.balanceOf(investor);

            result.toString().should.equal(tokens('100'), "investor Mock Dai wallet balance correct before staking");

            //Stake Mock Dai;
            await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor});
            await tokenFarm.stakeTokens(tokens('100'), {from: investor});

            result = await daiToken.balanceOf(investor);
            result.toString().should.equal(tokens('0'), "investor Mock Dai wallet balance correct after staking");

            result = await daiToken.balanceOf(tokenFarm.address);
            result.toString().should.equal(tokens('100'), "TokeFarm Mock Dai wallet balance correct after staking");

            result = await tokenFarm.stakingBalance(investor);
            result.toString().should.equal(tokens('100'), "investor staking balance correct after staking");


            result = await tokenFarm.isStaking(investor);
            result.toString().should.equal('true', "investor isstaking  correct after staking");

            //issue tokens
            await tokenFarm.issueTokens({from: owner});

            //check balance after issuing tokens
            result = await dappToken.balanceOf(investor);
            result.toString().should.equal(tokens('100'), "investor dApp Tokens correct after issuance of Token");

            await tokenFarm.issueTokens({from: investor}).should.be.rejected;

            //Check result after UnStaking;

            await tokenFarm.unStakeTokens({from: investor});

            result = await daiToken.balanceOf(investor);
            result.toString().should.equal(tokens('100'), 'investor mock dai balance after unstaking')

            result = await daiToken.balanceOf(tokenFarm.address);
            result.toString().should.equal(tokens('0'), "TokeFarm Mock Dai wallet balance correct after unstaking");
            
            result = await tokenFarm.stakingBalance(investor);
            result.toString().should.equal(tokens('0'), "investor staking balance correct after unstaking");

            result = await tokenFarm.isStaking(investor);
            result.toString().should.equal('false', "investor isstaking  correct after unstaking");

            
        });
    })

});
