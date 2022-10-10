// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/interfaces/IERC721.sol";

interface ISpells is IERC721 {
    event Minted(uint256 indexed tokenId, address indexed to, string spell);

    function tokenId() external view returns (uint256);
}
