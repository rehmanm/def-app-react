import React, { Component } from 'react'
import Web3 from 'web3';
import Navbar from './Navbar'
import './App.css'

class App extends Component {

 
  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  handleClick = async (e) => {
        await this.loadWeb3();
    await this.loadBlockChainData()
  }

  async loadWeb3() {
    console.log("window", window, window.alert, typeof window.ethereum, window.innerHeight );
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
    console.log("loadBlockChainData")
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    this.setState({account: accounts[0]})
    console.log(accounts);
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
              

                <h1>Hello, World!</h1> 
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
      account: '0x0'
    };    
  }
}

export default App;