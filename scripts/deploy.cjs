const { ethers, network, hre } = require("hardhat"); // Added 'network' and 'hre' for clarity
const fs = require("fs");

async function main() {
  console.log("Deploying Medical Records and Health Data Token contracts...");

  // Get the contract factories
  const MedicalRecords = await ethers.getContractFactory("MedicalRecords");
  const HealthDataToken = await ethers.getContractFactory("HealthDataToken");

  // Deploy HealthDataToken first
  console.log("Deploying HealthDataToken...");
  const healthDataToken = await HealthDataToken.deploy();
  await healthDataToken.deployed(); // <-- THE FIX: Use .deployed()
  console.log("HealthDataToken deployed to:", healthDataToken.address); // <-- THE FIX: Use .address

  // Deploy MedicalRecords
  console.log("Deploying MedicalRecords...");
  const medicalRecords = await MedicalRecords.deploy();
  await medicalRecords.deployed(); // <-- THE FIX: Use .deployed()
  console.log("MedicalRecords deployed to:", medicalRecords.address); // <-- THE FIX: Use .address

  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    healthDataToken: healthDataToken.address,
    medicalRecords: medicalRecords.address,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment completed! Addresses saved to deployment.json");

  // Verify contracts on Etherscan (if on mainnet/testnet)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await medicalRecords.deployTransaction.wait(6);
    await healthDataToken.deployTransaction.wait(6);

    console.log("Verifying contracts on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: medicalRecords.address, // <-- THE FIX: Use .address
        constructorArguments: [],
      });
      await hre.run("verify:verify", {
        address: healthDataToken.address, // <-- THE FIX: Use .address
        constructorArguments: [],
      });
      console.log("Contracts verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });