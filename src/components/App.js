import React, { Component } from 'react'
import Web3 from 'web3';
import Navbar from './Navbar';
import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";
import Main from "./Main"
import './App.css';

class App extends Component {

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadWeb3() {
    window.web3 = new Web3(window.ethereum)
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  
  async loadBlockChainData(){ 
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.setState({account: accounts[0]})
    //Load DaiToken
    await this.loadDaiToken();

    //Load DappToken
    await this.loadDappToken();

    //Load TokenFarm
    await this.loadTokenFarm();

    this.setState({loading: false});
  }

  loadDaiToken = async () =>{
    let web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const daiTokenData = DaiToken.networks[networkId];
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
      this.setState({daiToken});
      await this.loadDaiTokenBalance();
    } else {
      window.alert("DaiToken contract not deployed to detected network");
    }
  }

  loadDaiTokenBalance = async() =>{
    
    let daiTokenBalance = await this.state.daiToken.methods.balanceOf(this.state.account).call();
    this.setState({daiTokenBalance}); 
  }

  loadDappToken = async() =>{
    let web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const dappTokenData = DappToken.networks[networkId];
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address);
      this.setState({dappToken});
      await this.loadDappTokenBalance();

    } else {
      window.alert("DappToken contract not deployed to detected network");
    }
  }

  loadDappTokenBalance = async() =>{
    
    let dappTokenBalance = await this.state.dappToken.methods.balanceOf(this.state.account).call();
    this.setState({dappTokenBalance}); 
  }

  loadTokenFarm = async() => {
    let web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const tokenFarmData = TokenFarm.networks[networkId];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
      this.setState({tokenFarm});
      await this.loadStakingBalance();
    } else {
      window.alert("Token Farm contract not deployed to detected network");
    }
  }

  loadStakingBalance = async() => {
    
    let stakingBalance = await this.state.tokenFarm.methods.stakingBalance(this.state.account).call();
    this.setState({stakingBalance}); 
  }

  stakeTokens = async (amount) => {
    this.setState({loading: true});
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({from: this.state.account}).on('transactionHash', (hash) =>{
      this.state.tokenFarm.methods.stakeTokens(amount).send({from: this.state.account}).on("transactionHash", async (hash) => {
        await this.loadDappTokenBalance();
        await this.loadStakingBalance();
        //Dai Token Balance not refreshing due to time taken by network
        await this.loadDaiTokenBalance();
        this.setState({loading: false});
      });
    });
  }
  unStakeTokens= async ()=>{
    this.setState({loading: true});
      this.state.tokenFarm.methods.unStakeTokens().send({from: this.state.account}).on("transactionHash", async (hash) => {
        await this.loadDappTokenBalance();
        await this.loadStakingBalance();
        //Dai Token Balance not refreshing due to time taken by network
        await this.loadDaiTokenBalance();
        this.setState({loading: false});
      });
    
    };

  render() {
    let content;
    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading</p>
    } else 
    {
      content = <Main 
      daiTokenBalance = {this.state.daiTokenBalance}
      dappTokenBalance = {this.state.dappTokenBalance}
      stakingBalance = {this.state.stakingBalance}
      stakeTokens = {this.stakeTokens}
      unStakeTokens = {this.unStakeTokens}
      
      
      />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                { content }
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
  
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      daiToken: {},
      dapToken: {},
      tokenFarm: {},
      daiTokenBalance: 0,
      dappTokenBalance: 0,
      stakingBalance: 0,
      loading: true
    };
  }
}

export default App;