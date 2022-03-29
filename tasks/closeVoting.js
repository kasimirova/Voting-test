const {CONTRACT_ADDRESS} = require("../config.js")

task("closeVoting", "Close Voting").addParam("id", "Voting id").setAction(async (taskArgs) => {
    let Voting = await hre.ethers.getContractAt("Voting", CONTRACT_ADDRESS);
    await Voting.closeVoting(taskArgs.id);
  });