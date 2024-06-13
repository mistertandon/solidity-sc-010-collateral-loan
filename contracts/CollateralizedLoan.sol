// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ParveshToken is ERC20("Parvesh", "PARI") {
    constructor(uint256 initialSupply) {
        _mint(msg.sender, initialSupply);
    }
}

contract CollateralizedLoan {
    IERC20 collateralToken;

    address payable owner;

    uint256 private _interestRate;

    uint256 private _minCollateralRatio;

    mapping(address => uint256) public collateral;

    enum LoanStatus {
        Funded,
        Repaid,
        Liquidated
    }

    struct LoanInfo {
        address borrower;
        uint256 borrowAmount;
        uint256 collateralAmount;
        uint256 timestamp;
        LoanStatus status;
    }

    mapping(address => LoanInfo) public loans;

    event LoanRequestRecieved(
        address borrower,
        uint256 borrowAmount,
        uint256 collateralAmount
    );

    function getInterestRate() public view returns (uint256) {
        return _interestRate;
    }

    function getMinCollateralRatio() public view returns (uint256) {
        return _minCollateralRatio;
    }

    constructor(
        uint256 interestRate,
        uint256 minCollateralRatio,
        address collateralTokenAddress
    ) payable {
        require(interestRate > 0, "Invalid interest Rate");
        require(minCollateralRatio > 0, "Invalid Collateral Ratio");

        owner = payable(msg.sender);

        _interestRate = interestRate;
        _minCollateralRatio = minCollateralRatio;
        collateralToken = IERC20(collateralTokenAddress);
    }

    modifier onlyOwner() {
        LoanInfo memory _loanInfo = loans[msg.sender];
        require(msg.sender == owner, "Unauthorized to access");
        _;
    }

    modifier onlyInState(LoanStatus loanStatus) {
        LoanInfo memory _loanInfo = loans[msg.sender];
        require(
            _loanInfo.status == loanStatus,
            "Invalid Loan state to call requested function"
        );
        _;
    }

    function _sendEthers(
        address reciever,
        uint256 amount
    ) public payable returns (bool) {
        (bool send, ) = payable(reciever).call{value: amount}("");
        return send;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");

        // Emit the deposit event
        //   emit Deposited(msg.sender, msg.value);
    }

    function requestLoan(
        uint256 _borrowAmount,
        uint256 _collateralAmount
    ) public payable {
        uint256 collateralTokenHoldByBorrower = collateralToken.balanceOf(
            msg.sender
        );
        console.log(
            "collateralTokenHoldByBorrower",
            collateralTokenHoldByBorrower
        );
        require(
            collateralTokenHoldByBorrower >= _collateralAmount,
            "Insufficient fund to handle collateral amount"
        );

        uint256 extraAmountToLiquidate = (_borrowAmount * getInterestRate()) /
            100;

        console.log("extraAmountToLiquidate", extraAmountToLiquidate);
        require(
            _collateralAmount >= (_borrowAmount + extraAmountToLiquidate),
            "Insufficient collateral amount"
        );

        require(
            getBalance() >= _borrowAmount,
            "Unsufficient fund to grant loan"
        );
        collateralToken.transferFrom(
            msg.sender,
            address(this),
            _collateralAmount
        );
        collateral[msg.sender] += msg.value;

        bool transactionStatus = _sendEthers(msg.sender, _borrowAmount);

        require(transactionStatus, "Loan could not funded");

        LoanInfo memory loanInfo = LoanInfo({
            borrower: msg.sender,
            borrowAmount: _borrowAmount,
            collateralAmount: _collateralAmount,
            timestamp: block.timestamp,
            status: LoanStatus.Funded
        });

        loans[msg.sender] = loanInfo;
        emit LoanRequestRecieved(msg.sender, _borrowAmount, _collateralAmount);
    }

    function withdrawCollateral() internal {
        LoanInfo memory loanInfo = loans[msg.sender];

        collateralToken.transfer(msg.sender, loanInfo.collateralAmount);
        console.log("withdrawCollateral");
    }

    function repaidLoan() public payable {
        LoanInfo memory loanInfo = loans[msg.sender];

        uint256 outstandingAmount = calculateOutstandingAmount(loanInfo);

        require(
            msg.value >= outstandingAmount,
            "Unsufficient amount to repay loan"
        );

        bool transactionStatus = _sendEthers(msg.sender, outstandingAmount);

        require(transactionStatus, "Loan could not repaid");
        withdrawCollateral();
    }

    function calculateAccruedInterest(
        LoanInfo memory loaninfo
    ) private view returns (uint256) {
        uint256 timeLapsed = block.timestamp - loaninfo.timestamp;
        return
            (loaninfo.borrowAmount * getInterestRate() * timeLapsed) /
            (100 * 365 days);
    }

    function calculateOutstandingAmount(
        LoanInfo memory loaninfo
    ) private view returns (uint256) {
        return loaninfo.borrowAmount + calculateAccruedInterest(loaninfo);
    }
}
