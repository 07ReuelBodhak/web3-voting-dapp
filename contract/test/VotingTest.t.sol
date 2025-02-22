// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Deploy} from "../script/Deploy.s.sol";
import {Voting} from "../src/Voting.sol";

contract VotingTest is Test {
    Voting voting;
    address USER = makeAddr("user");

    function setUp() external {
        Deploy deploy = new Deploy();
        voting = deploy.run();
    }

    function testVotingForLanguage() public {
        voting.vote("Rust");
        uint256 length = voting.getLanguageLength();
        assertEq(length, 1);
    }

    function testGettingVote() public {
        voting.vote("Rust");
        int256 voteCount = voting.getVote("Rust");
        assertEq(voteCount, 1);
    }
}