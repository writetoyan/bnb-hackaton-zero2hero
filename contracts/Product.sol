//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

error OfferEnded();
error AmountSentTooLow();
error YouDidNotParticipatedInThatOffer();
error WaitForEvaluationPeriodDelay();
error ThereIsAMinAmountToLock();
error EvaluationPeriodNotOver();
error OnlyOwnerCanWithdrawFunds();
error ThereIsAProblemWithYourProduct();
error WithdrawFailed();

contract Product {

    uint256 constant DELAY_EVALUATION_OPEN = 14 days;
    uint256 constant EVALUATION_PERIOD = 14 days;
    uint256 constant AMOUNT_TO_LOCK_FOR_VOTING_NO_CONFORM = 0.1 ether;

    struct ProductInfo {
        string name;
        uint256 marketPrice;
        uint256 discountedPrice;
        uint128 quantityTreshold;
        uint128 endDate;
    }

    struct ProductConformity {
        uint256 noConform;
        uint256 conform;
    }

    uint256 public quantitySold;
    address public owner;
    ProductInfo public productInfo;
    ProductConformity public productConformity;
    mapping(address => uint256) public quantityBought;
    mapping(address => mapping(bool => uint256)) public participantEvaluation;

    constructor(address _owner, string memory _name, uint256 _marketPrice, uint256 _discountedPrice, uint128 _quantityTreshold, uint128 _endDate) {
        owner = _owner;
        ProductInfo memory _productInfo = ProductInfo(_name, _marketPrice, _discountedPrice, _quantityTreshold, _endDate);
        productInfo = _productInfo;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert OnlyOwnerCanWithdrawFunds();
        }
        _;
    }

    modifier withdrawFundsRequirement() {
        if (block.timestamp < productInfo.endDate + DELAY_EVALUATION_OPEN + EVALUATION_PERIOD) {
            revert EvaluationPeriodNotOver();
        }
        uint256 numberOfVotes = productConformity.noConform + productConformity.conform;
        if (productConformity.noConform * 10000 / numberOfVotes > 3000) {
            revert ThereIsAProblemWithYourProduct();
        }
        _;
    }

    
    function participate(uint256 quantityToBuy) external payable {
        if (block.timestamp > productInfo.endDate) {
            revert OfferEnded();
        }
        if (msg.value < quantityToBuy * productInfo.discountedPrice) {
            revert AmountSentTooLow();
        }
        quantitySold += quantityToBuy;
        quantityBought[msg.sender] += quantityToBuy;
    }
    
    function evaluateProduct(bool conformity) external payable {
        uint256 votingPower = quantityBought[msg.sender];
        if (block.timestamp < productInfo.endDate + DELAY_EVALUATION_OPEN) {
            revert WaitForEvaluationPeriodDelay();
        }
        if ( votingPower < 1) {
            revert YouDidNotParticipatedInThatOffer();
        }
        if (conformity) {
            productConformity.conform += votingPower;
            participantEvaluation[msg.sender][true] += votingPower;
        } else {
            if (msg.value < AMOUNT_TO_LOCK_FOR_VOTING_NO_CONFORM) {
                revert ThereIsAMinAmountToLock();
            }
            productConformity.noConform += votingPower;
            participantEvaluation[msg.sender][false] += votingPower;
        }
    }

    function withdrawProductOfSells() external onlyOwner withdrawFundsRequirement {
        uint amountToWithdraw = quantitySold * productInfo.discountedPrice;
        (bool success, ) = payable(address(msg.sender)).call{value: amountToWithdraw}("");
        if (!success) {
            revert WithdrawFailed();
        }
    }
    

    function withdrawEvaluationConformPrice() external withdrawFundsRequirement {
        uint amountWon = (productConformity.noConform * AMOUNT_TO_LOCK_FOR_VOTING_NO_CONFORM) * 10000 / productConformity.conform;
        (bool success, ) = payable(address(msg.sender)).call{value: amountWon * participantEvaluation[msg.sender][true] / 10000}("");
        if (!success) {
            revert WithdrawFailed();
        }
    }
}