const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying event contract...");
  const accounts = await ethers.getSigners();
  const Event = await ethers.getContractFactory("EventContract");
  const event = await Event.connect(accounts[0]).deploy();
  console.log(`Event contract deployed at ${event.address}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
