// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/XRPLBridge.sol";
import "../src/AgeVerifier.sol";

contract MockAgeVerifier {
    mapping(address => bool) public isVerified;

    function setVerified(address user, bool verified) external {
        isVerified[user] = verified;
    }
}

contract XRPLBridgeTest is Test {
    XRPLBridge public bridge;
    MockAgeVerifier public mockVerifier;

    function setUp() public {
        mockVerifier = new MockAgeVerifier();
        bridge = new XRPLBridge(address(mockVerifier));
    }

    function testLinkXRPLAccount() public {
        string memory xrplAccount = "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH";

        mockVerifier.setVerified(address(this), true);

        bridge.linkXRPLAccount(xrplAccount);

        assertEq(bridge.getLinkedXRPLAccount(address(this)), xrplAccount);
        assertEq(bridge.getLinkedEthAccount(xrplAccount), address(this));
    }

    function testCannotLinkWithoutVerification() public {
        string memory xrplAccount = "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH";

        vm.expectRevert("Age not verified");
        bridge.linkXRPLAccount(xrplAccount);
    }

    function testCannotLinkEmptyAccount() public {
        mockVerifier.setVerified(address(this), true);

        vm.expectRevert("Invalid XRPL account");
        bridge.linkXRPLAccount("");
    }

    function testCannotLinkAlreadyLinkedAccount() public {
        string memory xrplAccount = "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH";
        address user1 = address(0x1);
        address user2 = address(0x2);

        mockVerifier.setVerified(user1, true);
        mockVerifier.setVerified(user2, true);

        vm.prank(user1);
        bridge.linkXRPLAccount(xrplAccount);

        vm.prank(user2);
        vm.expectRevert("XRPL account already linked");
        bridge.linkXRPLAccount(xrplAccount);
    }
}