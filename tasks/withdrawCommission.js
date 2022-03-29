const {CONTRACT_ADDRESS} = require("../config.js")

task("withdrawCommission", "Withdraw commission").setAction(async (taskArgs) => {
    let Voting = await hre.ethers.getContractAt("Voting", CONTRACT_ADDRESS);
    await Voting.withdrawCommission();
  });