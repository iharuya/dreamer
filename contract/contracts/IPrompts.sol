// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/interfaces/IERC721.sol";

// Minimum definitions of functions which other contracts call
interface IPrompts {
    event AssetMinted(
        uint256 indexed tokenId,
        address indexed to,
        string prompt
    );

    function nextTokenId() external view returns (uint256);
}
