import React, { Component } from 'react'; 
import dai from "../dai.png";

class Main extends Component {
    fromWei(n){
        return window.web3.utils.fromWei(n, 'Ether')
    }
    toWei(n){
        return window.web3.utils.toWei(n, 'Ether')
    }
  render() {
    return (
      <div id="content" className="mt-3">

         <table className="table table-borderless text-muted text-center">
             <thead>
                 <tr>
                    <th scope="col"> Staking Balance</th>
                    <th scope="col"> Reward Balance</th>
                 </tr>
             </thead>
             <tbody>
                 <tr>
                     <td>{this.fromWei(this.props.stakingBalance)} mDAI</td>
                     <td>{this.fromWei(this.props.dappTokenBalance)} DAPP</td>
                 </tr>
             </tbody>
         </table>

         <div className="card mb-4">
            <div className="card-body">
                <form className="mb-3" onSubmit={(event)=> {
                    event.preventDefault();
                    let amount;
                    amount = this.input.value.toString();
                    amount = this.toWei(amount);
                    this.props.stakeTokens(amount);
                }}>
                    <div>
                        <label className="float-left"><b>Stake Tokens</b></label>
                        <span className="float-right text-muted">
                            Balance: {this.fromWei(this.props.daiTokenBalance)}
                        </span>
                    </div>
                    <div className="input-group mb-4">
                        <input
                        type="text"
                        ref={(input) => {this.input = input}}
                        className="form-control form-control-lg"
                        placeholder="0" 
                        required/>
                        <div className="input-group-append">
                            <div className="input-group-text">
                                <img src={dai} height='32' alt='' /> mDAI
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
                </form>
                <button 
                type="submit" 
                className="btn btn-primary btn-block btn-sm"
                onClick={(event)=>{
                    event.preventDefault();
                    this.props.unStakeTokens();
                }}
                >Un STAKE!</button>
            </div>
         </div>
      </div>
    );
  }
}

export default Main;