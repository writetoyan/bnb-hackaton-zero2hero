//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import './Product.sol';

/// @title Product Contract Factory
/// @notice This contract should be used to deploy the Product contract
contract ProductFactory {
    
    Product[] public products;

    /// @notice Event emitted when a new product is created
    event NewProductCreated(address product, string name);

    /// @notice Main function used to deploy a new Product contract
    function createProduct(string memory _name, uint256 _marketPrice, uint256 _discountedPrice, uint128 _quantityTreshold, uint128 _endDate) external returns (bool productCreated) {
        Product product = new Product(msg.sender, _name, _marketPrice, _discountedPrice, _quantityTreshold, _endDate);
        products.push(product);
        emit NewProductCreated(address(product), _name);
        return productCreated;
    }
}