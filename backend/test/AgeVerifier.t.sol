// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/AgeVerifier.sol";

contract MockVerifier {
    function verifyProof(
        uint[2] memory,
        uint[2][2] memory,
        uint[2] memory,
        uint[1] memory _publicSignals
    ) external pure returns (bool) {
        return _publicSignals[0] == 1;
    }
}

contract AgeVerifierTest is Test {
    AgeVerifier public ageVerifier;
    MockVerifier public mockVerifier;

    function setUp() public {
        mockVerifier = new MockVerifier();
        ageVerifier = new AgeVerifier(address(mockVerifier));
    }

    function testVerifyAge() public {
        uint[2] memory pA = [uint(1), uint(2)];
        uint[2][2] memory pB = [[uint(3), uint(4)], [uint(5), uint(6)]];
        uint[2] memory pC = [uint(7), uint(8)];
        uint[1] memory publicSignals = [uint(1)];

        assertFalse(ageVerifier.isVerified(address(this)));

        ageVerifier.verifyAge(pA, pB, pC, publicSignals);

        assertTrue(ageVerifier.isVerified(address(this)));
    }

    function testCannotVerifyTwice() public {
        uint[2] memory pA = [uint(1), uint(2)];
        uint[2][2] memory pB = [[uint(3), uint(4)], [uint(5), uint(6)]];
        uint[2] memory pC = [uint(7), uint(8)];
        uint[1] memory publicSignals = [uint(1)];

        ageVerifier.verifyAge(pA, pB, pC, publicSignals);

        vm.expectRevert("User already verified");
        ageVerifier.verifyAge(pA, pB, pC, publicSignals);
    }

    function testRevertWhenInvalidAge() public {
        uint[2] memory pA = [uint(1), uint(2)];
        uint[2][2] memory pB = [[uint(3), uint(4)], [uint(5), uint(6)]];
        uint[2] memory pC = [uint(7), uint(8)];
        uint[1] memory publicSignals = [uint(0)]; // Invalid age

        vm.expectRevert("Age verification failed");
        ageVerifier.verifyAge(pA, pB, pC, publicSignals);
    }
}