// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IVerifier {
    function verifyProof(
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[1] memory _publicSignals
    ) external view returns (bool);
}

contract AgeVerifier {
    IVerifier public immutable verifier;

    mapping(address => bool) public verifiedUsers;

    event UserVerified(address indexed user);

    constructor(address _verifier) {
        verifier = IVerifier(_verifier);
    }

    function verifyAge(
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[1] memory _publicSignals
    ) external {
        require(!verifiedUsers[msg.sender], "User already verified");
        require(_publicSignals[0] == 1, "Age verification failed");

        bool proofValid = verifier.verifyProof(_pA, _pB, _pC, _publicSignals);
        require(proofValid, "Invalid proof");

        verifiedUsers[msg.sender] = true;
        emit UserVerified(msg.sender);
    }

    function isVerified(address user) external view returns (bool) {
        return verifiedUsers[user];
    }
}