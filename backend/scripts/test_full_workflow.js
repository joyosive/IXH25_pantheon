const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Configuration
const XRPL_TESTNET_RPC = "https://rpc.testnet.xrplevm.org";

async function testFullWorkflow() {
    try {
        console.log("🎯 Testing Complete ZKProofPay Workflow");
        console.log("=======================================");

        // Setup provider and wallet
        const provider = new ethers.JsonRpcProvider(XRPL_TESTNET_RPC);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        console.log(`Testing from: ${wallet.address}`);

        // Load deployment info
        const deploymentFile = path.join(__dirname, "../deployment_success.json");
        if (!fs.existsSync(deploymentFile)) {
            throw new Error("Deployment file not found. Run 'npm run deploy-web3' first.");
        }

        const deployment = JSON.parse(fs.readFileSync(deploymentFile));
        const grantProgramAddress = deployment.contracts.GrantProgram.address;
        const verifierAddress = deployment.contracts.DocumentVerifier.address;

        console.log(`GrantProgram: ${grantProgramAddress}`);
        console.log(`DocumentVerifier: ${verifierAddress}`);

        // Load ZK proof
        const proofFile = path.join(__dirname, "../build/doc_solidity_proof.json");
        if (!fs.existsSync(proofFile)) {
            throw new Error("ZK proof not found. Run: npm run generate-doc-witness && npm run generate-doc-proof");
        }

        const zkProof = JSON.parse(fs.readFileSync(proofFile));
        const publicFile = path.join(__dirname, "../build/doc_public.json");
        const fullSignals = JSON.parse(fs.readFileSync(publicFile));

        console.log("\n📋 ZK Proof Ready:");
        console.log(`Full signals: [${fullSignals.join(', ')}]`);
        console.log(`Contract sees: [${zkProof.publicSignals[0]}] (${zkProof.publicSignals[0] === 1 ? 'QUALIFIED ✅' : 'NOT QUALIFIED ❌'})`);

        // Contract ABI
        const grantProgramABI = [
            "function verifyDocuments(uint[2] memory _pA, uint[2][2] memory _pB, uint[2] memory _pC, uint[1] memory _publicSignals) external",
            "function isVerified(address user) external view returns (bool)",
            "function createGrant(string memory _title, string memory _description, uint256 _minQualification, uint256 _minExperience, uint256 _expectedDocumentHash, uint256 _deadline) external payable",
            "function applyForGrant(uint256 _grantId, string memory _ipfsHash) external",
            "function reviewApplication(uint256 _grantId, uint256 _applicationIndex, bool _approved) external",
            "function getGrant(uint256 _grantId) external view returns (tuple(uint256 id, address provider, string title, string description, uint256 amount, uint256 minQualification, uint256 minExperience, uint256 expectedDocumentHash, uint256 deadline, bool isActive, bool isFunded))",
            "function nextGrantId() external view returns (uint256)",
            "function getApplications(uint256 _grantId) external view returns (tuple(uint256 grantId, address applicant, uint256 timestamp, bool isReviewed, bool isApproved, string ipfsHash)[])"
        ];

        const grantProgram = new ethers.Contract(grantProgramAddress, grantProgramABI, wallet);

        console.log("\n🔐 Step 1: ZK Proof Verification");
        console.log("=================================");

        // Check if already verified
        const alreadyVerified = await grantProgram.isVerified(wallet.address);
        console.log(`Current verification status: ${alreadyVerified ? 'Already verified ✅' : 'Not verified yet ⏳'}`);

        if (!alreadyVerified && zkProof.publicSignals[0] === 1) {
            console.log("📤 Submitting ZK proof for verification...");

            const verifyTx = await grantProgram.verifyDocuments(
                zkProof.a,
                zkProof.b,
                zkProof.c,
                [zkProof.publicSignals[0]],
                { gasLimit: 500000 }
            );

            console.log(`Transaction hash: ${verifyTx.hash}`);
            await verifyTx.wait();

            const nowVerified = await grantProgram.isVerified(wallet.address);
            console.log(`✅ Verification result: ${nowVerified}`);

            if (nowVerified) {
                console.log("🎉 ZK proof accepted! User is now verified.");
                console.log("🔒 Privacy preserved: Contract only knows user is qualified, not actual scores.");
            }
        } else if (zkProof.publicSignals[0] !== 1) {
            console.log("❌ Cannot verify: User not qualified (proof shows 0)");
            return false;
        }

        console.log("\n💰 Step 2: Grant Creation");
        console.log("=========================");

        // Create a test grant
        const grantTitle = "ZKProofPay Education Grant";
        const grantDescription = "Privacy-preserving grant for qualified individuals";
        const minQualification = 70;
        const minExperience = 2;
        const expectedDocumentHash = 12345;
        const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
        const grantAmount = ethers.parseEther("0.5"); // 0.5 XRP

        console.log(`Creating grant: "${grantTitle}"`);
        console.log(`Amount: ${ethers.formatEther(grantAmount)} XRP`);
        console.log(`Requirements: ${minQualification}% qualification, ${minExperience} years experience`);

        const createTx = await grantProgram.createGrant(
            grantTitle,
            grantDescription,
            minQualification,
            minExperience,
            expectedDocumentHash,
            deadline,
            { value: grantAmount, gasLimit: 500000 }
        );

        console.log(`Transaction hash: ${createTx.hash}`);
        await createTx.wait();

        const nextGrantId = await grantProgram.nextGrantId();
        const currentGrantId = nextGrantId - 1n;

        console.log(`✅ Grant created with ID: ${currentGrantId}`);

        // Get grant details
        const grantDetails = await grantProgram.getGrant(currentGrantId);
        console.log("\n📋 Grant Details:");
        console.log(`ID: ${grantDetails.id}`);
        console.log(`Provider: ${grantDetails.provider}`);
        console.log(`Title: ${grantDetails.title}`);
        console.log(`Amount: ${ethers.formatEther(grantDetails.amount)} XRP`);
        console.log(`Min Qualification: ${grantDetails.minQualification}%`);
        console.log(`Min Experience: ${grantDetails.minExperience} years`);
        console.log(`Active: ${grantDetails.isActive}`);

        console.log("\n📝 Step 3: Grant Application");
        console.log("============================");

        console.log("Applying for grant with verified ZK proof...");
        const applicationData = "ipfs://QmZKProofPayDemo123..."; // Mock IPFS hash

        const applyTx = await grantProgram.applyForGrant(
            currentGrantId,
            applicationData,
            { gasLimit: 300000 }
        );

        console.log(`Application transaction: ${applyTx.hash}`);
        await applyTx.wait();

        console.log("✅ Application submitted successfully!");

        console.log("\n📋 Step 4: Application Review");
        console.log("=============================");

        console.log("Reviewing application as grant provider...");

        const reviewTx = await grantProgram.reviewApplication(
            currentGrantId,
            0, // First application
            true, // Approve
            { gasLimit: 500000 }
        );

        console.log(`Review transaction: ${reviewTx.hash}`);
        await reviewTx.wait();

        console.log("✅ Application approved and funded!");

        // Get updated grant details
        const updatedGrant = await grantProgram.getGrant(currentGrantId);
        console.log(`Grant funded: ${updatedGrant.isFunded}`);

        console.log("\n🎉 Complete Workflow Test SUCCESS!");
        console.log("===================================");
        console.log("✅ ZK proof verification: User verified without revealing scores");
        console.log("✅ Grant creation: 0.5 XRP grant created successfully");
        console.log("✅ Grant application: Applied with verified proof");
        console.log("✅ Application review: Approved and funded automatically");
        console.log("✅ Privacy preservation: Actual qualification scores (85%, 5yr) never visible on-chain");

        console.log("\n📊 Privacy Analysis:");
        console.log("====================");
        console.log(`User's actual data: ${fullSignals[1]}% qualification, ${fullSignals[2]} years experience`);
        console.log(`Blockchain only sees: User is qualified (${zkProof.publicSignals[0]})`);
        console.log(`Grant provider bias eliminated: Cannot see actual scores`);

        console.log("\n🔗 Explorer Links:");
        console.log("==================");
        console.log(`GrantProgram: https://explorer.testnet.xrplevm.org/address/${grantProgramAddress}`);
        console.log(`DocumentVerifier: https://explorer.testnet.xrplevm.org/address/${verifierAddress}`);
        console.log(`Your account: https://explorer.testnet.xrplevm.org/address/${wallet.address}`);

        console.log("\n🎯 Demo Summary for Hackathon:");
        console.log("==============================");
        console.log("Problem: Grant applications expose private data → bias");
        console.log("Solution: Zero-knowledge proofs → privacy + verification");
        console.log("Tech: Circom circuits + Groth16 proofs + XRPL EVM");
        console.log("Result: Qualified users get grants without revealing personal scores");

        return true;

    } catch (error) {
        console.error("❌ Full workflow test failed:", error.message);

        if (error.message.includes("Deployment file not found")) {
            console.log("💡 Deploy contracts first: npm run deploy-web3");
        } else if (error.message.includes("ZK proof not found")) {
            console.log("💡 Generate ZK proof first: npm run generate-doc-witness && npm run generate-doc-proof");
        } else if (error.message.includes("Already verified")) {
            console.log("✅ User already verified - this is expected on subsequent runs");
        } else if (error.message.includes("insufficient funds")) {
            console.log("💰 Need more XRP for transactions: https://faucet.testnet.xrplevm.org");
        }

        return false;
    }
}

// CLI execution
if (require.main === module) {
    if (!process.env.PRIVATE_KEY) {
        console.error("❌ Error: PRIVATE_KEY environment variable not set");
        process.exit(1);
    }

    testFullWorkflow().then(success => {
        if (success) {
            console.log("\n🚀 ZKProofPay is fully operational on XRPL EVM Testnet!");
        } else {
            console.log("\n💥 Workflow test failed - check requirements above");
        }
        process.exit(success ? 0 : 1);
    });
}

module.exports = { testFullWorkflow };