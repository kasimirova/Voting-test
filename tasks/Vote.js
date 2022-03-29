const {CONTRACT_ADDRESS} = require("../config.js")

task("vote", "vote").addParam("candidate", "Candidate's address").addParam("id", "Voting id").setAction(async (taskArgs) => {
    let Voting = await hre.ethers.getContractAt("Voting", CONTRACT_ADDRESS);
    await Voting.vote(taskArgs.candidates, taskArgs.id);
  });