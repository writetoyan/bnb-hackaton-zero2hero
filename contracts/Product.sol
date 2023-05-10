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


/// @title Product Contract
/// @notice Use this contract to participate in a group buy and vote for conformity of the product
/// @notice For the company, use this contract to withdraw your funds from the sells
/// @dev This is contract should be deployed through the ProductFactory contract to keep track of all the products created

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

    /// @notice Event emitted when someone participate in the group buy
    event ParticipateGroupBuy(address participant, uint256 amount);
    /// @notice Event emitted when a participant evaluate the product received as conform
    event EvaluateConform(address participant, uint votingPower);
    /// @notice Event emitted when a participant evaluate the product received as non conform
    event EvaluateNoConform(address participant, uint votingPower);
    /// @notice Event emitted when the company withdraw the product of the sell
    event ProductOfSellsWithdrawn(address owner, uint amount);
    /// @notice Event emitted when participant voted for conform product. The amount comes from people who evaluated the product as non conform but lost
    event EvaluationConformPriceWithdrawn(address participant, uint amount);

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

    /// @notice Main function of the contract. Use this one to participate in a group by and specify the amount you want to buy
    function participate(uint256 quantityToBuy) external payable {
        if (block.timestamp > productInfo.endDate) {
            revert OfferEnded();
        }
        if (msg.value < quantityToBuy * productInfo.discountedPrice) {
            revert AmountSentTooLow();
        }
        quantitySold += quantityToBuy;
        quantityBought[msg.sender] += quantityToBuy;
        emit ParticipateGroupBuy(msg.sender, quantityToBuy);
    }
    
    /// @notice Function used to evaluate the product received
    /// @dev When the offer is closed, we let the company 14 days to send the product. Then the buyers can evaluate the product
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
            emit EvaluateConform(msg.sender, votingPower);
        } else {
            if (msg.value < AMOUNT_TO_LOCK_FOR_VOTING_NO_CONFORM) {
                revert ThereIsAMinAmountToLock();
            }
            productConformity.noConform += votingPower;
            participantEvaluation[msg.sender][false] += votingPower;
            emit EvaluateNoConform(msg.sender, votingPower);
        }
    }

    /// @notice The company call this function to withdraw the product of the sells
    /// @dev The function works if the evaluation have a conformity vote of more than 30% and after a voting period of 14 days
    function withdrawProductOfSells() external onlyOwner withdrawFundsRequirement {
        uint amountToWithdraw = quantitySold * productInfo.discountedPrice;
        (bool success, ) = payable(address(msg.sender)).call{value: amountToWithdraw}("");
        if (!success) {
            revert WithdrawFailed();
        }
        emit ProductOfSellsWithdrawn(msg.sender, amountToWithdraw);
    }
    
    /// @notice This function is used to let the buyer who voted conform and won to get the amount of BNB locked from people who voted no conform
    /// @notice This mecanism is to incite people to vote if the product they received are conform and prevent only people that are disatified to evaluate
    function withdrawEvaluationConformPrice() external withdrawFundsRequirement {
        uint amountWon = (productConformity.noConform * AMOUNT_TO_LOCK_FOR_VOTING_NO_CONFORM) * 10000 / productConformity.conform;
        (bool success, ) = payable(address(msg.sender)).call{value: amountWon * participantEvaluation[msg.sender][true] / 10000}("");
        if (!success) {
            revert WithdrawFailed();
        }
        emit EvaluationConformPriceWithdrawn(msg.sender, amountWon);
    }
}