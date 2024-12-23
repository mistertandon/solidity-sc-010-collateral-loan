Hello, everyone.  

In this video, we will explore how to execute a collateral loan smart contract written in Solidity.  

From an overview perspective, the implementation involves two smart contracts to facilitate the collateral loan process.  

1. **CollateralizedLoan Contract**: This smart contract governs all the conditions and manages the entire loan lifecycle, including borrowing, repayments, and liquidations.  
2. **ParveshToken Contract**: This serves as the collateral, ensuring the borrower provides sufficient assets to secure the loan.  

Let's begin by compiling these two contracts to initiate the implementation.  


Let me click the **Compile** button to compile the smart contracts.  

In the dropdown menu, we can now see that the compiled **ParveshToken** and **CollateralizedLoan** contracts are available.  

Next, navigate to the **Deploy and Run Transactions** menu. Under the **Contract** dropdown, you will find the compiled **ParveshToken** and **CollateralizedLoan** contracts listed.  

Start by selecting the **ParveshToken** contract. To mint 10 million tokens, input `10M` as the **Initial Supply** in the input field and then click the **Transact** button.  

For reference, note that multiple accounts are available, which act as owners authorized to deploy the smart contract. You can find detailed information about these accounts on the top-left side of the Remix IDE interface.  

Now, switch to the **CollateralizedLoan** smart contract and deploy it. During deployment, you will encounter several fields that require inputs:  
1. **Interest Rate**: Set this value to `10`.  
2. **Minimum Collateral Ratio**: This represents the required value of a borrower's collateral relative to the loan amount. Set this value to `20`.  
3. **Collateral Token Address**: In our case, this is the deployed address of the **ParveshToken** smart contract. It serves as the collateral for the loan.  

Once deployed, both contracts will be listed under the **Deployed Contracts** section.  

Now, let's transfer 1 million **ParveshToken** to Wallet B.  

1. First, select a wallet address from the available accounts and copy it to the clipboard.  
2. Switch back to the owner account, which is the first account in the dropdown list.  
3. In the **Deployed ParveshToken Contract** section, open the **Transfer** function.  
   - Paste the copied address into the **To** input field.  
   - Enter `1,000,000` as the value in the **Amount** input field.  
   - Click the **Transact** button to complete the transfer.  

The transfer of 1 million **ParveshToken** from Wallet A to Wallet B is now complete.  

To verify the transfer:  
- Use the **balanceOf** function in the **ParveshToken** smart contract.  
- Paste Wallet B's address into the account field of the **balanceOf** function.  
- Click the **Call** button.  
You will observe that Wallet B now holds 1 million **ParveshToken**.  

Next, Wallet B will apply for a loan by interacting with the **CollateralizedLoan** smart contract. Wallet B will request **10,000 wei** as the loan amount.  

Before this, Wallet B needs to interact with the **ParveshToken** smart contract to allow the **CollateralizedLoan** contract to spend a specified amount of **ParveshToken**. This mechanism ensures that if Wallet B fails to repay the loan within the specified timeframe, the **CollateralizedLoan** contract will liquidate these tokens to recover the loan.  

*Important Note*: The collateral token value must exceed the requested loan amount to ensure loan security.  

Steps to request a loan:  
1. Open the **CollateralizedLoan** smart contract under the **Deployed Contracts** section and switch to Wallet B's address.  
2. In the **Request Loan** subsection:  
   - Enter the **Borrow Amount** (10,000 wei).  
   - Enter the **Collateral Amount** (e.g., 20,000 **ParveshToken**).  
   - Click the **Transact** button.  

To verify the deduction of collateral:  
- Switch back to the **ParveshToken** deployed contract.  
- Use the **balanceOf** function with Wallet B's address.  
You will notice that 20,000 **ParveshToken** has been deducted.  

Additionally, verify that the **CollateralizedLoan** contract has received the tokens:  
- Copy the deployed address of the **CollateralizedLoan** contract.  
- Use it as input in the **balanceOf** function of the **ParveshToken** contract.  
You will confirm that the **CollateralizedLoan** smart contract holds 20,000 **ParveshToken**.  

Finally, Wallet B will repay the loan:  
1. Click the **Repay** function under the **CollateralizedLoan** contract.  
2. Send a little more than 10,000 wei as the repayment amount.  

To confirm successful repayment:  
- Use the **balanceOf** function in the **ParveshToken** contract.  
- Verify that the **CollateralizedLoan** smart contract no longer holds any tokens.  

This indicates that Wallet B has successfully repaid the loan.  
