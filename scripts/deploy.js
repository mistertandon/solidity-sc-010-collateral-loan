const hre = require("hardhat");
async function main() {
  console.log("Deplyment status:: START");
  const CollateralizedLoan = await hre.ethers.getContractFactory(
    "CollateralizedLoan"
  );
  const collateralizedLoan = await CollateralizedLoan.deploy();
  console.log(
    "CollateralizedLoan deployed to : ",
    JSON.stringify(collateralizedLoan)
  );
  console.log("Deplyment status:: START::SUCCESS");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("An error occurred during deployment: ", error);
    console.log("Deplyment status:: START::FAIL");
    process.exit(1);
  });
