//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

error YouAlreadyMintedYourSoulBound();
error YourSoulboundIsNotTransferable();
error YouCannotChangeOtherUserInfo();

/// @title DealChainSoul contract
/// @notice This contract is used to mint a Soulbound token to the user
contract DealChainSoul is ERC721 {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint private reputation;

    struct UserInfo {
        string name;
        string deliveryAddress;
        uint reputation;
    }

    UserInfo[] private userInfo;

    constructor() ERC721("DealChainSoul", "DCS") {}

    /// @notice User of the Dealchain use this function to mint a Soulbound token
    function mint(string calldata _name, string calldata _deliveryAddress) external {
        uint currentTokenId = _tokenIdCounter.current();
        UserInfo memory  _userInfo = UserInfo(_name, _deliveryAddress, 0);
        userInfo.push(_userInfo);
        _safeMint(msg.sender, currentTokenId);
        _tokenIdCounter.increment();
    }

    /// @notice User use this function to change their delivery address
    /// @dev Only the address that own that soulbound is able to call this function
    function changeDeliveryAddress(uint tokenId, string memory _deliveryAddress) external returns(bool) {
        if (msg.sender != ownerOf(tokenId)) {
            revert YouCannotChangeOtherUserInfo();
        }
        userInfo[tokenId].deliveryAddress = _deliveryAddress;
        return true;
    }

    /// @notice Sellers can get the info of their customers from this function
    function getUserInfo(uint tokenId) external view returns (UserInfo memory) {
        return userInfo[tokenId];
    }

    /// @dev Hook to disactivate the transferable functionnality
    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal view override {
        if(balanceOf(msg.sender) != 0) {
            revert YouAlreadyMintedYourSoulBound();
        }
        if(from != address(0)) {
            revert YourSoulboundIsNotTransferable();
        }
    }
}