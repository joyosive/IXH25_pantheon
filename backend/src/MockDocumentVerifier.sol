// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract MockDocumentVerifier {
    function verifyProof(
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[1] memory _publicSignals
    ) external pure returns (bool) {
        // Mock implementation for demo - validates if public signal is 1
        // In production, this would contain actual Groth16 verification
        return _publicSignals[0] == 1;
    }
}