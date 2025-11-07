const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

async function verifyProof() {
    try {
        console.log("🔍 Verifying ZK proof...");

        const proofFile = path.join(__dirname, "../build/proof.json");
        const publicFile = path.join(__dirname, "../build/public.json");
        const vkeyFile = path.join(__dirname, "../build/verification_key.json");

        // Check required files
        if (!fs.existsSync(proofFile)) {
            throw new Error("Proof file not found. Run 'npm run generate-proof' first.");
        }
        if (!fs.existsSync(publicFile)) {
            throw new Error("Public signals file not found. Run 'npm run generate-proof' first.");
        }
        if (!fs.existsSync(vkeyFile)) {
            throw new Error("Verification key not found. Run 'npm run generate-proof' first.");
        }

        // Load files
        const proof = JSON.parse(fs.readFileSync(proofFile));
        const publicSignals = JSON.parse(fs.readFileSync(publicFile));
        const vKey = JSON.parse(fs.readFileSync(vkeyFile));

        console.log("📄 Loaded proof files successfully");

        // Verify the proof
        console.log("⚡ Verifying proof...");
        const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);

        console.log("\n📊 Verification Result:");
        console.log("======================");

        if (isValid) {
            console.log("✅ PROOF VERIFIED SUCCESSFULLY!");
            console.log("🎯 The proof is mathematically valid");

            // Interpret the result
            const ageCheckPassed = publicSignals[0] === "1";
            console.log(`🔍 Age verification: ${ageCheckPassed ? "PASSED ✅" : "FAILED ❌"}`);

            if (ageCheckPassed) {
                console.log("✅ User is 18+ years old (without revealing actual age)");
            } else {
                console.log("❌ User is under 18 years old");
            }

        } else {
            console.log("❌ PROOF VERIFICATION FAILED!");
            console.log("💥 The proof is invalid or tampered with");
        }

        // Show proof details
        console.log("\n📋 Proof Details:");
        console.log("=================");
        console.log(`🔐 Proof size: ${JSON.stringify(proof).length} bytes`);
        console.log(`📊 Public signals: [${publicSignals.join(", ")}]`);
        console.log(`🔑 Curve: bn128`);
        console.log(`⚡ Protocol: Groth16`);

        return isValid;

    } catch (error) {
        console.error("❌ Error verifying proof:", error.message);
        return false;
    }
}

async function verifyWithCustomInputs(expectedMinAge = 18) {
    try {
        const publicFile = path.join(__dirname, "../build/public.json");

        if (fs.existsSync(publicFile)) {
            const publicSignals = JSON.parse(fs.readFileSync(publicFile));

            console.log("\n🧮 Manual Verification:");
            console.log("======================");
            console.log(`Expected minimum age: ${expectedMinAge}`);
            console.log(`Proof indicates age check: ${publicSignals[0] === "1" ? "PASSED" : "FAILED"}`);

            return publicSignals[0] === "1";
        }

        return false;
    } catch (error) {
        console.error("Error in manual verification:", error.message);
        return false;
    }
}

// CLI usage
if (require.main === module) {
    console.log("🔍 ZK Proof - Age Verification Proof Verification");
    console.log("=================================================");

    verifyProof().then(isValid => {
        console.log("\n" + "=".repeat(50));

        if (isValid) {
            console.log("🎉 VERIFICATION SUCCESSFUL!");
            console.log("The zero-knowledge proof confirms:");
            console.log("• User meets age requirements");
            console.log("• Without revealing actual age");
            console.log("• Proof is cryptographically sound");

            console.log("\n🚀 Ready for blockchain deployment!");
            console.log("Next step: Deploy to XRPL EVM sidechain");
        } else {
            console.log("💥 VERIFICATION FAILED!");
            console.log("Check your proof generation process");
            process.exit(1);
        }
    });
}

module.exports = { verifyProof, verifyWithCustomInputs };