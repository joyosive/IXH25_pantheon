// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IDocumentVerifier {
    function verifyProof(
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[1] memory _publicSignals
    ) external view returns (bool);
}

contract GrantProgram {
    IDocumentVerifier public immutable documentVerifier;

    struct Grant {
        uint256 id;
        address provider;
        string title;
        string description;
        uint256 amount;
        uint256 minQualification;
        uint256 minExperience;
        uint256 expectedDocumentHash;
        uint256 deadline;
        bool isActive;
        bool isFunded;
    }

    struct Application {
        uint256 grantId;
        address applicant;
        uint256 timestamp;
        bool isReviewed;
        bool isApproved;
        string ipfsHash;
    }

    mapping(uint256 => Grant) public grants;
    mapping(uint256 => Application[]) public grantApplications;
    mapping(address => bool) public verifiedApplicants;
    mapping(address => uint256[]) public applicantGrants;

    uint256 public nextGrantId = 1;
    uint256 public totalApplications = 0;

    event GrantCreated(uint256 indexed grantId, address indexed provider, uint256 amount);
    event ApplicationSubmitted(uint256 indexed grantId, address indexed applicant, uint256 applicationIndex);
    event ApplicationReviewed(uint256 indexed grantId, address indexed applicant, bool approved);
    event ApplicantVerified(address indexed applicant);
    event GrantFunded(uint256 indexed grantId, address indexed recipient, uint256 amount);

    constructor(address _documentVerifier) {
        documentVerifier = IDocumentVerifier(_documentVerifier);
    }

    function verifyDocuments(
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[1] memory _publicSignals
    ) external {
        require(!verifiedApplicants[msg.sender], "Already verified");
        require(_publicSignals[0] == 1, "Document verification failed");

        bool proofValid = documentVerifier.verifyProof(_pA, _pB, _pC, _publicSignals);
        require(proofValid, "Invalid ZK proof");

        verifiedApplicants[msg.sender] = true;
        emit ApplicantVerified(msg.sender);
    }

    function createGrant(
        string memory _title,
        string memory _description,
        uint256 _minQualification,
        uint256 _minExperience,
        uint256 _expectedDocumentHash,
        uint256 _deadline
    ) external payable {
        require(msg.value > 0, "Grant amount must be > 0");
        require(_deadline > block.timestamp, "Deadline must be in future");

        Grant storage grant = grants[nextGrantId];
        grant.id = nextGrantId;
        grant.provider = msg.sender;
        grant.title = _title;
        grant.description = _description;
        grant.amount = msg.value;
        grant.minQualification = _minQualification;
        grant.minExperience = _minExperience;
        grant.expectedDocumentHash = _expectedDocumentHash;
        grant.deadline = _deadline;
        grant.isActive = true;
        grant.isFunded = false;

        emit GrantCreated(nextGrantId, msg.sender, msg.value);
        nextGrantId++;
    }

    function applyForGrant(uint256 _grantId, string memory _ipfsHash) external {
        require(verifiedApplicants[msg.sender], "Must verify documents first");
        require(grants[_grantId].isActive, "Grant not active");
        require(grants[_grantId].deadline > block.timestamp, "Grant deadline passed");
        require(!grants[_grantId].isFunded, "Grant already funded");

        Application memory application = Application({
            grantId: _grantId,
            applicant: msg.sender,
            timestamp: block.timestamp,
            isReviewed: false,
            isApproved: false,
            ipfsHash: _ipfsHash
        });

        grantApplications[_grantId].push(application);
        applicantGrants[msg.sender].push(_grantId);

        uint256 applicationIndex = grantApplications[_grantId].length - 1;
        totalApplications++;

        emit ApplicationSubmitted(_grantId, msg.sender, applicationIndex);
    }

    function reviewApplication(uint256 _grantId, uint256 _applicationIndex, bool _approved) external {
        require(grants[_grantId].provider == msg.sender, "Only grant provider can review");
        require(_applicationIndex < grantApplications[_grantId].length, "Invalid application index");

        Application storage application = grantApplications[_grantId][_applicationIndex];
        require(!application.isReviewed, "Application already reviewed");

        application.isReviewed = true;
        application.isApproved = _approved;

        emit ApplicationReviewed(_grantId, application.applicant, _approved);

        if (_approved) {
            _fundGrant(_grantId, application.applicant);
        }
    }

    function _fundGrant(uint256 _grantId, address _recipient) internal {
        Grant storage grant = grants[_grantId];
        require(!grant.isFunded, "Grant already funded");
        require(grant.amount <= address(this).balance, "Insufficient contract balance");

        grant.isFunded = true;
        grant.isActive = false;

        (bool success, ) = _recipient.call{value: grant.amount}("");
        require(success, "Transfer failed");

        emit GrantFunded(_grantId, _recipient, grant.amount);
    }

    function getGrant(uint256 _grantId) external view returns (Grant memory) {
        return grants[_grantId];
    }

    function getApplications(uint256 _grantId) external view returns (Application[] memory) {
        return grantApplications[_grantId];
    }

    function getApplicantGrants(address _applicant) external view returns (uint256[] memory) {
        return applicantGrants[_applicant];
    }

    function isVerified(address _applicant) external view returns (bool) {
        return verifiedApplicants[_applicant];
    }
}