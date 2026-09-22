// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Transactions} from "../src/Transactions.sol";

contract TransactionsTest is Test {
    Transactions transactions;

    address sender = address(0x1);
    address receiver = address(0x2);

    function setUp() public {
        transactions = new Transactions();

        vm.deal(sender, 10 ether);
    }

    function testSendTransaction() public {
        uint256 receiverBalanceBefore = receiver.balance;

        vm.prank(sender);

        transactions.sendTransaction{value: 1 ether}(
            payable(receiver),
            "Hello",
            "coffee"
        );

        assertEq(
            receiver.balance,
            receiverBalanceBefore + 1 ether
        );

        assertEq(
            transactions.transactionCount(),
            1
        );
    }

    function testStoresTransaction() public {
    vm.prank(sender);

    transactions.sendTransaction{value: 1 ether}(
        payable(receiver),
        "Hello Krypt",
        "ethereum"
    );

    (
        address storedSender,
        address storedReceiver,
        uint256 amount,
        string memory message,
        string memory keyword,
        uint256 timestamp
    ) = transactions.transactions(0);

    assertEq(storedSender, sender);
    assertEq(storedReceiver, receiver);
    assertEq(amount, 1 ether);
    assertEq(message, "Hello Krypt");
    assertEq(keyword, "ethereum");
    assertGt(timestamp, 0);
}
function testRevertsIfAmountIsZero() public {
    vm.prank(sender);

    vm.expectRevert("Amount must be greater than zero");

    transactions.sendTransaction{value: 0}(
        payable(receiver),
        "Hello",
        "test"
    );
}
}