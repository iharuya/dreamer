// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ISpells.sol";

contract Spells is ERC721, Ownable, ISpells {
    uint256 public immutable MINT_PRICE;
    uint256 public nextTokenId = 1;
    string private _baseUri;

    constructor(uint256 mintPrice, string memory baseUri) ERC721("Spells", "SPL") {
        MINT_PRICE = mintPrice;
        setBaseUri(baseUri);
    }

    function addSpell(string memory spell) public payable {
        require(msg.value == MINT_PRICE, "Wrong price");
        _safeMint(msg.sender, nextTokenId);
        emit Minted(nextTokenId, msg.sender, spell);
        nextTokenId++;
    }

    function withdraw(uint256 amount) public onlyOwner {
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send value");
    }

    function setBaseUri(string memory uri) public onlyOwner {
        _baseUri = uri;
    }

    // ERC721: tokenURI() uses this function inside
    function _baseURI() internal view override returns (string memory) {
        return _baseUri;
    }
}
