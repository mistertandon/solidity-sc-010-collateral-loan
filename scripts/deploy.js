const hre = require("hardhat");
async function main() {

  console.log("ParveshToken::Deplyment status::START");
  const ParveshToken = await hre.ethers.getContractFactory(
    "ParveshToken"
  );
  const parveshToken = await ParveshToken.deploy(10000000);
  console.log(
    "ParveshToken deployed to : ",
    JSON.stringify(parveshToken)
  );
  console.log("ParveshToken::Deplyment status::END => SUCCESS");
  console.log("\n\n===============================================\n\n");

  console.log("CollateralizedLoan::Deplyment status::START");
  const CollateralizedLoan = await hre.ethers.getContractFactory(
    "CollateralizedLoan"
  );
      
  const collateralizedLoan = await CollateralizedLoan.deploy(INTEREST_RATE, MIN_COLLATERAL_RATIO, COLLATERAL_TOKEN_ADDRESS);
  console.log(
    "CollateralizedLoan deployed to : ",
    JSON.stringify(collateralizedLoan)
  );
  console.log("CollateralizedLoan::Deplyment status::END => SUCCESS");
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
