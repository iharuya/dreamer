// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Spells is ERC721, Ownable {
    uint256 private _tokenId = 1;
    uint256 private immutable _mintPrice;
    string private _baseUri;
    event Minted(uint256 indexed tokenId, address indexed to, string spell);
    struct Good {
        uint256 likes;
    }

    constructor(uint256 mintPrice_) ERC721("Spells", "SPL") {
        setBaseURI("https://example.com/");
        _mintPrice = mintPrice_;
    }

    function addSpell(string memory spell_) public payable {
        require(msg.value == _mintPrice, "Wrong price");
        _safeMint(msg.sender, _tokenId);
        emit Minted(_tokenId, msg.sender, spell_);
        _tokenId++;
    }

    function setBaseURI(string memory newUri_) public onlyOwner {
        _baseUri = newUri_;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUri;
    }
}
