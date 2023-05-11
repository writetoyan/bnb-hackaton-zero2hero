//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import './Product.sol';
import './PreProduct.sol';

/// @title Product Contract Factory
/// @notice This contract should be used to deploy the Product contract
contract ProductFactory {
    
    Product[] public products;
    PreProduct[] public preProducts;

    /// @notice Event emitted when a new product is created
    event NewProductCreated(address indexed product, string indexed name);
    /// @notice Eent emitted when a pre product is requested
    event NewPreProductRequested(address indexed company, string indexed productName, uint256 queryPrice);

    /// @notice Main function used to deploy a new Product contract
    function createProduct(address company, string memory _name, uint256 _marketPrice, uint256 _discountedPrice, uint128 _quantityTreshold, uint128 _endDate) external returns (bool productCreated) {
        Product product = new Product(company, _name, _marketPrice, _discountedPrice, _quantityTreshold, _endDate);
        products.push(product);
        emit NewProductCreated(address(product), _name);
        return productCreated;
    }

    /// @notice Everyone can create a preProduct to gather interest in a product from a company
    /// @notice If this shows enough interest, the company can accept and a normal Product will be created
    /// @dev The callback function is triggered when the company accept to create one on the PreProduct contract
    function requestCreateProduct(address _company, string memory _name, uint256 _queryPrice) external {
        PreProduct preProduct = new PreProduct();
        preProducts.push(preProduct);
        preProduct.query(_company, _name, _queryPrice, this.createProduct);
        emit NewPreProductRequested(_company, _name, _queryPrice);
    }
}