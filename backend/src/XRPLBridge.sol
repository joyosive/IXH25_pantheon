// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./AgeVerifier.sol";

contract XRPLBridge {
    AgeVerifier public immutable ageVerifier;

    mapping(address => string) public xrplAccounts;
    mapping(string => address) public ethAccounts;

    event AccountLinked(address indexed ethAccount, string xrplAccount);

    constructor(address _ageVerifier) {
        ageVerifier = AgeVerifier(_ageVerifier);
    }

    function linkXRPLAccount(string memory _xrplAccount) external {
        require(ageVerifier.isVerified(msg.sender), "Age not verified");
        require(bytes(_xrplAccount).length > 0, "Invalid XRPL account");
        require(ethAccounts[_xrplAccount] == address(0), "XRPL account already linked");

        string memory oldAccount = xrplAccounts[msg.sender];
        if (bytes(oldAccount).length > 0) {
            delete ethAccounts[oldAccount];
        }

        xrplAccounts[msg.sender] = _xrplAccount;
        ethAccounts[_xrplAccount] = msg.sender;

        emit AccountLinked(msg.sender, _xrplAccount);
    }

    function getLinkedXRPLAccount(address _ethAccount) external view returns (string memory) {
        return xrplAccounts[_ethAccount];
    }

    function getLinkedEthAccount(string memory _xrplAccount) external view returns (address) {
        return ethAccounts[_xrplAccount];
    }
}