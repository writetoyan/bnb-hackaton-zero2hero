//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

library DealChain {

    struct Request {
        address company;
        bytes32 name;
        uint256 queryPrice;
        function(address, bytes32, uint256, uint256, uint128, uint128) external returns (bool) createProduct;
        uint256 numberOfPotentialBuyer;
    }

    struct ProductInfo {
        bytes32 name;
        uint256 marketPrice;
        uint256 discountedPrice;
        uint128 quantityTreshold;
        uint128 endDate;
    }

    struct ProductConformity {
        uint256 noConform;
        uint256 conform;
    }

    struct UserInfo {
        string name;
        string deliveryAddress;
        uint reputation;
    }
}