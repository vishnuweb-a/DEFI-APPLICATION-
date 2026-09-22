// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

contract Transactions {

    struct Transaction {
    address sender;
    address receiver;
    uint256 amount;
    string message;
    string keyword;
    uint256 timestamp;
}
Transaction[] public transactions;
uint256 public transactionCount;
event Transfer(
    address indexed sender,
    address indexed receiver,
    uint256 amount,
    string message,
    string keyword,
    uint256 timestamp
);

function sendTransaction(
    address payable receiver,
    string calldata message,
    string calldata keyword
) external payable {

    // will write the transaction to the blockchain
    require(msg.value > 0, "Amount must be greater than zero");
    require(receiver != address(0), "Receiver address cannot be zero");
    (bool success , ) = receiver.call{value: msg.value}("");
    require(success, "Transaction failed");

    // Add the transaction to the array
    transactions.push(Transaction({
        sender: msg.sender,
        receiver: receiver,
        amount: msg.value,
        message: message,
        keyword: keyword,
        timestamp: block.timestamp
    }));
    transactionCount++;
}

function getAllTransactions()
    external
    view
    returns (Transaction[] memory)
{
    return transactions;
}

}