//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import './libraries/DealChain.sol';

error YouAlreadySentYourInterest();
error OnlyTheConcernedCompanyCanAccept();

/// @title PreProduct contract
/// @notice The objective of this contract is to propose a group buy for a product to a company by showing how many interest there is for it at a certain level of price
contract PreProduct {

    using DealChain for DealChain.Request;

    DealChain.Request public request;
    mapping (address => bool) potentialBuyer;

    event ProductOfferCreationAccepted(address indexed company, bytes32 productName, uint128 indexed quantityTreshold);

    /// @notice This function is used to store different information about the request for creation of a product
    function query(address company, bytes32 name, uint256 queryPrice, function(address, bytes32, uint256, uint256, uint128, uint128) external returns (bool) createProduct) external {
        request = (DealChain.Request(company, name, queryPrice, createProduct, 0));
    }

    /// @notice This function is used to gather the number of people who is interested in a group buy for this product
    /// @dev Each address can only call this function once
    function expressInterest() external {
        if (potentialBuyer[msg.sender] == true) {
            revert YouAlreadySentYourInterest();
        }
        potentialBuyer[msg.sender] = true;
        request.numberOfPotentialBuyer += 1;
    }

    /// @notice This function is used by the company to accept to create a group buy product at the price mentionned
    /// @dev Once the company call this function, it will trigger the callback function on the factory contract and create a new Product
    function acceptCreateProductOffer(uint256 marketPrice, uint128 quantityTreshold, uint128 endDate) external {
        if (msg.sender != request.company) {
            revert OnlyTheConcernedCompanyCanAccept();
        }
        request.createProduct(request.company, request.name, marketPrice, request.queryPrice, quantityTreshold, endDate);
        emit ProductOfferCreationAccepted(request.company, request.name, quantityTreshold);
    }

    /// @notice Getter function to check the number of potential buyer already expressed their interest
    function getNumberOfPotentialBuyer() external view returns (uint256) {
        return request.numberOfPotentialBuyer;
    }

}