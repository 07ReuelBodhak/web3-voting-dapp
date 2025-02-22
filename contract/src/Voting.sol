// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

//**Error */
error AlreadyVoted();

contract Voting {
    //** state variables */
    mapping(address => bool) private s_voters;
    mapping(string => int256) private s_vote;
    string[] private s_languages;

    //**Events */
    event VotingSucceed(address indexed voter,string language);

    //**Functions */
    function vote(string memory language) external {
        if(s_voters[msg.sender]){
            revert AlreadyVoted();
        }
        if(s_vote[language] == 0){
            s_languages.push(language);
        }
        s_voters[msg.sender] = true;
        s_vote[language]++;
        emit VotingSucceed(msg.sender,language);
    }

    //** getter Functions */
    function getVote(string memory language) external view returns(int256) {
        return s_vote[language];
    }

    function getLanguageLength() external returns(uint256) {
        return s_languages.length;
    }
}
