//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import './Product.sol';
import './PreProduct.sol';
import './Treasury.sol';

/// @title Product Contract Factory
/// @notice This contract should be used to deploy the Product contract
contract ProductFactory {
    
    Treasury public treasury;
    Product[] public products;  
    PreProduct[] public preProducts;

    /// @notice Event emitted when a new product is created
    event NewProductCreated(address indexed company, uint256 price, bytes32 indexed name);
    /// @notice Eent emitted when a pre product is requested
    event NewPreProductRequested(address indexed company, bytes32 indexed productName, uint256 queryPrice);

    constructor() {
        treasury = new Treasury();
    }

    /// @notice Main function used to deploy a new Product contract
    function createProduct(address company, bytes32 _name, uint256 _marketPrice, uint256 _discountedPrice, uint128 _quantityTreshold, uint128 _endDate) external returns (bool productCreated) {
        Product product = new Product(company, address(treasury), _name, _marketPrice, _discountedPrice, _quantityTreshold, _endDate);
        products.push(product);
        emit NewProductCreated(company, _discountedPrice, _name);
        return productCreated;
    }

    /// @notice Everyone can create a preProduct to gather interest in a product from a company
    /// @notice If this shows enough interest, the company can accept and a normal Product will be created
    /// @dev The callback function is triggered when the company accept to create one on the PreProduct contract
    function requestCreateProduct(address _company, bytes32 _name, uint256 _queryPrice) external {
        PreProduct preProduct = new PreProduct();
        preProducts.push(preProduct);
        preProduct.query(_company, _name, _queryPrice, this.createProduct);
        emit NewPreProductRequested(_company, _name, _queryPrice);
    }
}