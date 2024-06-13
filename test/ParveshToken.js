const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ParveshToken", function () {
  let Token;
  let parveshToken;
  let owner;
  let addr1;
  let addr2;

  let initialSupply = ethers.parseEther("1000") // 1000 tokens with 18 decimals

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ParveshToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    parveshToken = await Token.deploy(initialSupply);
    // await parveshToken.deploy();
  });

  describe("Deployment", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await parveshToken.balanceOf(owner.address);
      expect(await parveshToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await parveshToken.transfer(addr1.address, ethers.parseEther("50"));
      const addr1Balance = await parveshToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.parseEther("50"));

      // Transfer 50 tokens from addr1 to addr2
      await parveshToken.connect(addr1).transfer(addr2.address, ethers.parseEther("50"));
      const addr2Balance = await parveshToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.parseEther("50"));
      const addr1BalanceAfter = await parveshToken.balanceOf(addr1.address);
      expect(addr1BalanceAfter).to.equal(ethers.parseEther("0"));
    });
  });
});
