//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Voting {
    struct voteInfo {
        uint256 timeOfCreating;
        uint256 allAmountOfMoney;
        address payable winner;
        bool isClosed;
        address[] candidate;
        mapping (address => bool) participants;
        mapping (address => uint256) candidatesResults;
    }

    mapping (uint256 => voteInfo) public voting;
    address payable ownerAddress;
    uint256 idForVoting;
    uint256 public commission;

    constructor() {
        ownerAddress = payable(msg.sender);
    }

    modifier onlyOwner(){
        require(msg.sender == ownerAddress, "Sender is not an owner");
        _;
    }

    function addVoting(address[] memory candidates) public onlyOwner{
        voting[idForVoting].timeOfCreating = block.timestamp;
        voting[idForVoting].candidate = candidates;
        idForVoting++;
    }

    function vote(address payable candidate, uint256 id) public payable {
        require(voting[id].participants[msg.sender] == false, "You can vote only once");
        require(msg.value == 0.01 ether, "Not enough or too much money");
        voting[id].candidatesResults[candidate]++;
        if (voting[id].candidatesResults[candidate] > voting[id].candidatesResults[voting[id].winner]){
            voting[id].winner = candidate;
        }
        voting[id].participants[msg.sender] = true;
        voting[id].allAmountOfMoney += msg.value;
    }

    function closeVoting(uint256 id) public {
        require(voting[id].isClosed == false, "The voting is already closed");
        require(block.timestamp - voting[id].timeOfCreating >= 259200, "It's too soon to close this voting");
        voting[id].winner.transfer(voting[id].allAmountOfMoney/100*90);
        commission+=voting[id].allAmountOfMoney/100*10;
        voting[id].isClosed = true;
    }

    function withdrawCommission() public onlyOwner{
        ownerAddress.transfer(commission);
        commission = 0;
    }
    
    function getCandidatesOfTheVoting(uint256 id) public view returns (address[] memory)
    {
        return voting[id].candidate;
    }

    function getCurrentWinner(uint256 id) public view returns (address)
    {
        return voting[id].winner;
    }

    function getAmountOfVotesForCandidate(uint256 id, address candidate) public view returns (uint256)
    {
        return voting[id].candidatesResults[candidate];
    }

    function checkIfParticipantMadeHisVote(uint256 id, address participant) public view returns (bool)
    {
        return voting[id].participants[participant];
    }

    function getAllAmountOfMoney(uint256 id) public view returns (uint256)
    {
        return voting[id].allAmountOfMoney;
    }
}
