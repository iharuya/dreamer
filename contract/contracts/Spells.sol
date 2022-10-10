// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ISpells.sol";

contract Spells is ERC721, Ownable, ISpells {
    uint256 public tokenId = 1;
    uint256 private immutable _mintPrice;
    string private _baseUri;

    constructor(uint256 mintPrice_) ERC721("Spells", "SPL") {
        setBaseURI("https://example.com/metadata/spells/");
        _mintPrice = mintPrice_;
    }

    function addSpell(string memory spell_) public payable {
        require(msg.value == _mintPrice, "Wrong price");
        _safeMint(msg.sender, tokenId);
        emit Minted(tokenId, msg.sender, spell_);
        tokenId++;
    }

    function setBaseURI(string memory newUri_) public onlyOwner {
        _baseUri = newUri_;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUri;
    }
}
