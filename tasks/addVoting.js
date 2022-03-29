const {CONTRACT_ADDRESS} = require("../config.js")

task("addVoting", "Add voting").addParam("candidates", "Array of candidate's addresses").setAction(async (taskArgs) => {
    let Voting = await hre.ethers.getContractAt("Voting", CONTRACT_ADDRESS);
    await Voting.addVoting(taskArgs.candidates);
  });