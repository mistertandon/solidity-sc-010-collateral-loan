const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CollateralizedLoan", function () {
  let CollateralizedLoan;
  let collateralizedLoan;
  let collateralToken;
  let owner;
  let addr1;
  let addr2;
  let initialSupply = ethers.parseEther("1000"); // 1000 tokens with 18 decimals
  let interestRate = 5; // 5%
  let minCollateralRatio = 150; // 150%

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the mock collateral token
    const ParveshToken = await ethers.getContractFactory("ParveshToken");
    collateralToken = await ParveshToken.deploy(initialSupply);

    // Transfer some tokens to addr1
    await collateralToken.transfer(addr1.address, ethers.parseEther("500"));

    // Deploy the CollateralizedLoan contract
    CollateralizedLoan = await ethers.getContractFactory("CollateralizedLoan");
    collateralizedLoan = await CollateralizedLoan.deploy(interestRate, minCollateralRatio, collateralToken.target, { value: ethers.parseEther("100") });
    // await collateralizedLoan.deployed();
  });

  describe("requestLoan", function () {
    it("Should allow a user to request a loan with sufficient collateral", async function () {
      const borrowAmount = ethers.parseEther("10");
      const collateralAmount = ethers.parseEther("20"); // 200% collateral

      // Approve collateral transfer
      await collateralToken.connect(addr1).approve(collateralizedLoan.target, collateralAmount);

      // Request the loan
      await expect(collateralizedLoan.connect(addr1).requestLoan(borrowAmount, collateralAmount))
        .to.emit(collateralizedLoan, "LoanRequestRecieved")
        .withArgs(addr1.address, borrowAmount, collateralAmount);

      // Check loan details
      const loan = await collateralizedLoan.loans(addr1.address);
      expect(loan.borrowAmount).to.equal(borrowAmount);
      expect(loan.collateralAmount).to.equal(collateralAmount);
      expect(loan.status).to.equal(0); // LoanStatus.Funded

      // Check the balance of the borrower after the loan is funded
      const addr1Balance = await ethers.provider.getBalance(addr1.address);
      expect(addr1Balance).to.be.closeTo(ethers.parseEther("10010"), ethers.parseEther("1")); // Considering gas fees

      // Check collateral is transferred to the contract
      const contractCollateralBalance = await collateralToken.balanceOf(collateralizedLoan.target);
      expect(contractCollateralBalance).to.equal(collateralAmount);
    });

    it("Should revert if collateral is insufficient", async function () {
      const borrowAmount = ethers.parseEther("10");
      const collateralAmount = ethers.parseEther("5"); // 50% collateral, insufficient

      // Approve collateral transfer
      await collateralToken.connect(addr1).approve(collateralizedLoan.target, collateralAmount);

      // Request the loan and expect revert
      await expect(collateralizedLoan.connect(addr1).requestLoan(borrowAmount, collateralAmount))
        .to.be.revertedWith("Insufficient collateral amount");
    });

    it("Should revert if contract has insufficient funds", async function () {
      const borrowAmount = ethers.parseEther("200");
      const collateralAmount = ethers.parseEther("300"); // 150% collateral

      // Approve collateral transfer
      await collateralToken.connect(addr1).approve(collateralizedLoan.target, collateralAmount);

      // Request the loan and expect revert
      await expect(collateralizedLoan.connect(addr1).requestLoan(borrowAmount, collateralAmount))
        .to.be.revertedWith("Unsufficient fund to grant loan");
    });
  });
});
