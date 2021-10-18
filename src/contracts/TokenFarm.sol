pragma solidity ^0.5.0;
import "./DappToken.sol";
import './DaiToken.sol';

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    address[] public stakers;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // 1 Stakes Token (Deposit)

    function stakeToken(uint _amount) public {

        require(_amount > 0, "amount can't be 0");

        //Transfer Mock Dai to this contract for stacking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //Update Stacking Balacne
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add users to stackers array only if they haven't stacked
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // 2 UnStaking Token (Withdraw)

    function unStakeTokens() public {
        uint balance = stakingBalance[msg.sender];

        require(balance > 0, "stakingBalance can't be 0");

        daiToken.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;
        isStaking [msg.sender] = false;
    }

    
    // 3 Stakes Token (Issuing Token)
    function issueTokens() public {
        require(msg.sender == owner, "only owner can call this function");
        for (uint i = 0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
    
}
