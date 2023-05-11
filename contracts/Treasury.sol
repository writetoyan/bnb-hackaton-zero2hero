//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

error NotTheOwner();

/// @title Treasury contract
contract Treasury {

    address owner;

    constructor() {
        owner = msg.sender;
    } 

    /// @dev Function to receive platform fees when the company withdraw his product of the sells
    receive() payable external {}

    /// @notice The owner or multisigs if implemented can use this function to withdraw the platform fees
    function withdrawPlatformFees(address payable to) external {
        if (msg.sender != owner) {
            revert NotTheOwner();
        }
        (bool success, ) = to.call{value: address(this).balance}("");
        require(success);
    }
}