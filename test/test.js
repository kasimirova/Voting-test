const { expect } = require("chai");
const { ethers } = require("hardhat");
let Voting;
let voting;
let owner, addr1, addr2, addr3, addr4, addr5;
let provider;

describe("Voting", function () {
  before(async function () 
  {
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    [owner, addr1, addr2, addr3, addr4, addr5, addr6] = await ethers.getSigners();
    await voting.deployed();
    provider = waffle.provider;
  });

  it("Make a voting as an owner", async function () {
    await voting.addVoting([addr1.address, addr2.address]);
    expect((await voting.getCandidatesOfTheVoting(0))[0]).to.equal(addr1.address);
  }
  );

  it("Make a voting as not an owner", async function () {
    await (expect(await voting.connect(addr1).addVoting([addr2.address, addr3.address]))).to.be.revertedWith("Sender is not an owner"); 
  }
  );

  it("Make a vote with enough money", async function () {
    await (voting.connect(addr3)).vote(addr1.address, 0, {value: ethers.utils.parseEther("0.01")});
    await (voting.connect(addr4)).vote(addr2.address, 0, {value: ethers.utils.parseEther("0.01")});
    await (voting.connect(addr1)).vote(addr2.address, 0, {value: ethers.utils.parseEther("0.01")});  
    expect(await voting.connect(addr3).getCurrentWinner(0)).to.equal(addr2.address); 
  }
  );

  it("Make a vote with not enough money", async function () {
    expect(await voting.connect(addr6).vote(addr2.address, 0, {value: ethers.utils.parseEther("0.001")})).to.be.revertedWith("Not enough or too much money"); 
  }
  );

  it("Make a vote second time", async function () {
    expect(await voting.connect(addr3).vote(addr2.address, 0, {value: ethers.utils.parseEther("0.001")})).to.be.revertedWith("You can vote only once"); 
  }
  );

  it("Get amount of votes for candidate", async function () {
    expect(await voting.getAmountOfVotesForCandidate(0, addr2.address)).to.equal(2); 
  }
  );

  it("Check if participant made his vote", async function () {
    expect(await voting.checkIfParticipantMadeHisVote(0, addr3.address)).to.equal(true); 
  }
  );

  it("Close voting earlier", async function () {
    await network.provider.send("evm_increaseTime", [259100]);
    await network.provider.send("evm_mine");
    expect(await voting.connect(addr3).closeVoting(0)).to.be.revertedWith("It's too soon to close this voting"); 

  }
  );
  
  it("Close voting after three days", async function () {
    const balanceBefore = await provider.getBalance(voting.address);
    await network.provider.send("evm_increaseTime", [300]);
    await network.provider.send("evm_mine");
    await voting.connect(addr3).closeVoting(0);
    expect(balanceBefore-(await provider.getBalance(voting.address))).to.equal((await voting.connect(addr3).getAllAmountOfMoney(0))/100*90); 
  }
  );

  it("Close already closed voting", async function () {
    expect(await voting.connect(addr3).closeVoting(0)).to.be.revertedWith("The voting is already closed"); 
  }
  );

  it("Withdraw commission as not an owner", async function () {
    expect(await voting.connect(addr3).withdrawCommission()).to.be.revertedWith("Sender is not an owner"); 
  }
  );

  it("Withdraw commission as an owner", async function () {
    const balanceBefore = await provider.getBalance(owner.address);
    await voting.withdrawCommission();
    let commission = await voting.commission();
    expect((await provider.getBalance(owner.address))).to.equal(balanceBefore.toString() + commission.toString()); 
  }
  );

});
