// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract Dreams is ERC1155, Ownable, ERC1155Supply {
    uint256 public immutable ALPHA;
    uint256 public immutable BETA;
    uint256 public immutable DELTA;

    constructor(
        uint256 alpha,
        uint256 beta,
        uint256 delta,
        string memory uri
    ) ERC1155(uri) {
        ALPHA = alpha;
        BETA = beta;
        DELTA = delta;
    }

    function setURI(string memory uri) external onlyOwner {
        _setURI(uri);
    }

    function mint(uint256 tokenId, uint256 amount) external payable {
        require(msg.value == mintValue(tokenId, amount), "wrong price");
        _mint(msg.sender, tokenId, amount, "");
    }

    function burn(
        address account,
        uint256 tokenId,
        uint256 amount
    ) external virtual {
        require(
            account == msg.sender || isApprovedForAll(account, msg.sender),
            "caller is not token owner nor approved"
        );
        uint256 payback = burnValue(tokenId, amount);
        _burn(account, tokenId, amount);
        (bool success, ) = payable(account).call{value: payback}("");
        require(success, "failed to send value");
    }

    function mintValue(uint256 tokenId, uint256 amount)
        public
        view
        returns (uint256)
    {
        uint256 a = totalSupply(tokenId) + 1;
        uint256 b = a + amount - 1;
        return ((b - a + 1) * (2 * (ALPHA + DELTA) + BETA * (a + b - 2))) / 2;
    }

    function burnValue(uint256 tokenId, uint256 amount)
        public
        view
        returns (uint256)
    {
        uint256 b = totalSupply(tokenId);
        uint256 a = b + 1 - amount;
        return ((b - a + 1) * (2 * ALPHA + BETA * (a + b - 2))) / 2;
    }

    // Collect revenue from the spread. Call this with caution.
    function withdraw(uint256 amount) external onlyOwner {
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "failed to send value");
    }

    // Patch supply features
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
