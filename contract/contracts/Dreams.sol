// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Dreams is ERC1155, Ownable, ERC1155Supply {
    uint256 public immutable ALPHA;
    uint256 public immutable BETA;
    uint256 public immutable DELTA;
    address public immutable SIGNER;

    mapping(uint256 => bool) public ticketIds;

    event Minted(address indexed to, uint256 indexed tokenId, uint256 indexed ticketId);

    constructor(
        uint256 alpha,
        uint256 beta,
        uint256 delta,
        address signer,
        string memory uri
    ) ERC1155(uri) {
        ALPHA = alpha;
        BETA = beta;
        DELTA = delta;
        SIGNER = signer;
    }

    function setURI(string memory uri) external onlyOwner {
        _setURI(uri);
    }

    function mint(
        uint256 ticketId,
        uint256 tokenId,
        uint256 expiresAt,
        bytes memory signature
    ) external payable {
        require(!ticketIds[ticketId], "Ticket has already been used");
        bytes32 messageHash = keccak256(abi.encodePacked(ticketId, msg.sender, tokenId, expiresAt));
        bytes32 ethSignedMessageHash = ECDSA.toEthSignedMessageHash(messageHash);
        require(ECDSA.recover(ethSignedMessageHash, signature) == SIGNER, "Forbidden");
        require(block.number <= expiresAt, "Signature expired");
        require(msg.value == mintValue(tokenId), "Wrong price sent");
        ticketIds[ticketId] = true;
        _mint(msg.sender, tokenId, 1, "");
        emit Minted(msg.sender, tokenId, ticketId);
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
        (bool success, ) = payable(msg.sender).call{value: payback}(""); // The receiver could be an operator.
        require(success, "failed to send value");
    }

    function mintValue(uint256 tokenId) public view returns (uint256) {
        return (ALPHA + DELTA) + BETA * (totalSupply(tokenId));
    }

    function burnValue(uint256 tokenId, uint256 amount) public view returns (uint256) {
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
