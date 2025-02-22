// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

//**imports */
import {Voting} from "../src/Voting.sol";
import {Script} from "forge-std/Script.sol";

//**Deploy contract */
contract Deploy is Script {
    function run() external returns(Voting) {
        vm.startBroadcast();
        Voting voting = new Voting();
        vm.stopBroadcast();
        return voting;
    }
}