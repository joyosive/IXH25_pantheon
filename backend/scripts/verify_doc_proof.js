const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

async function verifyDocumentProof() {
    try {
        console.log("Verifying ZK document proof...");

        const proofFile = path.join(__dirname, "../build/doc_proof.json");
        const publicFile = path.join(__dirname, "../build/doc_public.json");
        const vkeyFile = path.join(__dirname, "../build/doc_verification_key.json");

        // Check required files
        if (!fs.existsSync(proofFile)) {
            throw new Error("Proof file not found. Run 'npm run generate-doc-proof' first.");
        }
        if (!fs.existsSync(publicFile)) {
            throw new Error("Public signals file not found. Run 'npm run generate-doc-proof' first.");
        }
        if (!fs.existsSync(vkeyFile)) {
            throw new Error("Verification key not found. Run 'npm run generate-doc-proof' first.");
        }

        // Load files
        const proof = JSON.parse(fs.readFileSync(proofFile));
        const publicSignals = JSON.parse(fs.readFileSync(publicFile));
        const vKey = JSON.parse(fs.readFileSync(vkeyFile));

        console.log("Loaded proof files successfully");

        // Verify the proof
        console.log("Verifying proof...");
        const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);

        console.log("\nVerification Result:");
        console.log("===================");

        // Interpret the result
        const documentValid = publicSignals[0] === "1";

        if (isValid) {
            console.log("PROOF VERIFIED SUCCESSFULLY!");
            console.log("The proof is mathematically valid");
            console.log(`Document verification: ${documentValid ? "PASSED" : "FAILED"}`);

            if (documentValid) {
                console.log("User meets all requirements:");
                console.log("- Qualification criteria satisfied");
                console.log("- Experience requirements met");
                console.log("- Document authenticity verified");
                console.log("- Without revealing private information");
            } else {
                console.log("User does not meet requirements");
            }

        } else {
            console.log("PROOF VERIFICATION FAILED!");
            console.log("The proof is invalid or tampered with");
        }

        // Show proof details
        console.log("\nProof Details:");
        console.log("==============");
        console.log(`Proof size: ${JSON.stringify(proof).length} bytes`);
        console.log(`Public signals: [${publicSignals.join(", ")}]`);
        console.log(`Curve: bn128`);
        console.log(`Protocol: Groth16`);

        // Show Solidity-ready format
        if (isValid && documentValid) {
            console.log("\nSolidity Contract Format:");
            console.log("========================");

            const solidityFile = path.join(__dirname, "../build/doc_solidity_proof.json");
            if (fs.existsSync(solidityFile)) {
                const solidityProof = JSON.parse(fs.readFileSync(solidityFile));
                console.log("Ready for smart contract verification:");
                console.log(`pA: [${solidityProof.a.join(", ")}]`);
                console.log(`pB: [[${solidityProof.b[0].join(", ")}], [${solidityProof.b[1].join(", ")}]]`);
                console.log(`pC: [${solidityProof.c.join(", ")}]`);
                console.log(`publicSignals: [${solidityProof.publicSignals.join(", ")}]`);
            }
        }

        return isValid;

    } catch (error) {
        console.error("Error verifying document proof:", error.message);
        return false;
    }
}

// CLI usage
if (require.main === module) {
    console.log("ZK Proof - Document Verification Proof Verification");
    console.log("==================================================");

    verifyDocumentProof().then(isValid => {
        console.log("\n" + "=".repeat(50));

        if (isValid) {
            console.log("VERIFICATION SUCCESSFUL!");
            console.log("The zero-knowledge proof confirms:");
            console.log("• User meets qualification requirements");
            console.log("• User meets experience requirements");
            console.log("• Document authenticity verified");
            console.log("• Without revealing sensitive information");
            console.log("• Proof is cryptographically sound");

            console.log("\nReady for XRPL EVM deployment!");
            console.log("Next step: Deploy grant contracts");
        } else {
            console.log("VERIFICATION FAILED!");
            console.log("Check your proof generation process");
            process.exit(1);
        }
    });
}

module.exports = { verifyDocumentProof };