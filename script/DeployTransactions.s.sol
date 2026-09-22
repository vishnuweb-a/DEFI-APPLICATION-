// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {Transactions} from "../src/Transactions.sol";

contract DeployTransactions is Script {
    function run() external returns (Transactions) {
        vm.startBroadcast();

        Transactions transactions = new Transactions();

        vm.stopBroadcast();

        return transactions;
    }
}