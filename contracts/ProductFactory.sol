//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import './Product.sol';

contract ProductFactory {
    
    Product[] public products;

    event NewProductCreated(address product, string name);

    function createProduct(string memory _name, uint256 _marketPrice, uint256 _discountedPrice, uint128 _quantityTreshold, uint128 _endDate) external returns (bool productCreated) {
        Product product = new Product(msg.sender, _name, _marketPrice, _discountedPrice, _quantityTreshold, _endDate);
        products.push(product);
        emit NewProductCreated(address(product), _name);
        return productCreated;
    }
}