// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "./ISpells.sol";

contract Votes is ERC1155, Ownable, ERC1155Supply {
    uint256 public alpha;
    uint256 public beta;
    uint256 public delta;
    address private immutable _spells;

    constructor(address spells_) ERC1155("https://example.com/metadata/votes/{id}") {
        alpha = 1e16;
        beta = 1e15;
        delta = 1e14;
        _spells = spells_;
    }

    function setURI(string memory newUri_) public onlyOwner {
        _setURI(newUri_);
    }

    function vote(uint256 tokenId, uint256 amount) public payable {
        require(msg.value == voteCost(tokenId, amount), "Wrong price");
        require(tokenId > 0, "Wrong tokenId");
        require(tokenId < ISpells(_spells).tokenId(), "Wrong tokenId");
        _mint(msg.sender, tokenId, amount, "");
    }

    function unvote(
        address account,
        uint256 id,
        uint256 amount
    ) public virtual {
        require(
            account == msg.sender || isApprovedForAll(account, msg.sender),
            "Caller is not token owner nor approved"
        );
        uint256 payback = unvotePayback(id, amount);
        _burn(account, id, amount);
        (bool success, ) = payable(account).call{value: payback}("");
        require(success, "Failed to send value");
    }

    function voteCost(uint256 id, uint256 amount) public view returns (uint256) {
        uint256 a = totalSupply(id) + 1;
        uint256 b = a + amount - 1;
        return ((b - a + 1) * (4 * (alpha + delta) + beta * (a + b - 2))) / 2;
    }

    function unvotePayback(uint256 id, uint256 amount) public view returns (uint256) {
        uint256 b = totalSupply(id);
        uint256 a = b + 1 - amount;
        return ((b - a + 1) * (4 * alpha + beta * (a + b - 2))) / 2;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
