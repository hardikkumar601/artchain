// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArtChain {
    address public owner;
    mapping(uint256 => address) public artOwners;
    mapping(uint256 => uint256) public artPrices;
    mapping(uint256 => bool) public artExists;
    mapping(uint256 => bool) public isConfirmed;
    mapping(uint256 => address) public buyers;

    event ArtAdded(uint256 indexed artId, uint256 price);
    event ArtPurchased(address indexed buyer, uint256 indexed artId, uint256 price);
    event PurchaseConfirmed(address indexed seller, uint256 indexed artId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier artAvailable(uint256 artId) {
        require(artExists[artId], "Art does not exist");
        require(artOwners[artId] == address(0), "Art is already sold");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addArt(uint256 artId, uint256 price) public onlyOwner {
        require(!artExists[artId], "Art already exists");
        artExists[artId] = true;
        artPrices[artId] = price;
        emit ArtAdded(artId, price);
    }

    function purchaseArt(uint256 artId) public payable artAvailable(artId) {
        uint256 price = artPrices[artId];
        require(msg.value == price, "Incorrect value sent");
        require(!isConfirmed[artId], "Transaction already confirmed");

        artOwners[artId] = msg.sender;
        buyers[artId] = msg.sender;
        emit ArtPurchased(msg.sender, artId, price);
    }

    function confirmPurchase(uint256 artId) public onlyOwner {
        require(buyers[artId] != address(0), "No buyer for this art piece");
        require(!isConfirmed[artId], "Transaction already confirmed");

        isConfirmed[artId] = true;
        payable(owner).transfer(artPrices[artId]);

        emit PurchaseConfirmed(owner, artId);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
    }
}
