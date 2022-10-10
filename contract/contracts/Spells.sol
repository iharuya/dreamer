// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ISpells.sol";

contract Spells is ERC721, Ownable, ISpells {
    uint256 public tokenId = 1;
    uint256 public immutable MINT_PRICE;
    string private _baseUri;

    constructor(uint256 mintPrice) ERC721("Spells", "SPL") {
        setBaseURI("https://example.com/metadata/spells/");
        MINT_PRICE = mintPrice;
    }

    function addSpell(string memory spell) public payable {
        require(msg.value == MINT_PRICE, "Wrong price");
        _safeMint(msg.sender, tokenId);
        emit Minted(tokenId, msg.sender, spell);
        tokenId++;
    }

    function setBaseURI(string memory uri) public onlyOwner {
        _baseUri = uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUri;
    }
}
