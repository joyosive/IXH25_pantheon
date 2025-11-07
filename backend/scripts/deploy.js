const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

// XRPL EVM Testnet Configuration
const XRPL_EVM_CONFIG = {
    chainId: 1449000,
    rpcUrl: "https://rpc.testnet.xrplevm.org",
    name: "XRPL EVM Testnet",
    blockExplorer: "https://explorer.testnet.xrplevm.org"
};

async function main() {
    console.log("XRPL EVM ZK Proof Deployment");
    console.log("================================");

    try {
        console.log("Connecting to XRPL EVM Testnet...");

        // Connect to XRPL EVM Testnet
        const provider = new ethers.JsonRpcProvider(XRPL_EVM_CONFIG.rpcUrl);

        // Get private key from environment
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            throw new Error("PRIVATE_KEY not found in environment variables. Create .env file with your private key.");
        }

        // Create wallet from private key
        const wallet = new ethers.Wallet(privateKey, provider);
        console.log("Using wallet:", wallet.address);

        // Check network
        const network = await provider.getNetwork();
        console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);

        // Check balance
        const balance = await provider.getBalance(wallet.address);
        console.log(`Wallet balance: ${ethers.formatEther(balance)} XRP`);

        if (balance === 0n) {
            console.log("Warning: Wallet has no XRP. You'll need test XRP to deploy contracts.");
            console.log("Get test XRP from: https://faucet.tequ.dev/");
            console.log("XRPL EVM Testnet Explorer: https://explorer.testnet.xrplevm.org");
            return;
        }

        console.log("Deployment complete! Use Foundry for actual contract deployment:");
        console.log("PRIVATE_KEY=your_key ./deploy.sh");

    } catch (error) {
        console.error("Failed to connect:", error.message);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { XRPL_EVM_CONFIG };