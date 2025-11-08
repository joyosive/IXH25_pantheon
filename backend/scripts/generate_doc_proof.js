const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

async function generateDocumentProof() {
    try {
        console.log("Generating ZK proof for document verification...");

        const witnessFile = path.join(__dirname, "../build/doc_witness.wtns");
        const pkeyFile = path.join(__dirname, "../build/document_verify_0001.zkey");
        const vkeyFile = path.join(__dirname, "../build/doc_verification_key.json");

        // Check required files
        if (!fs.existsSync(witnessFile)) {
            throw new Error("Witness file not found. Run 'npm run generate-doc-witness' first.");
        }

        // Generate proving key if not exists
        if (!fs.existsSync(pkeyFile)) {
            console.log("Generating proving key (this may take a while)...");

            // Generate ceremony parameters
            await snarkjs.zKey.newZKey(
                path.join(__dirname, "../build/document_verify.r1cs"),
                path.join(__dirname, "../build/pot12_final.ptau"),
                pkeyFile
            );
            console.log("Proving key generated");
        }

        // Generate verification key if not exists
        if (!fs.existsSync(vkeyFile)) {
            console.log("Generating verification key...");
            const vKey = await snarkjs.zKey.exportVerificationKey(pkeyFile);
            fs.writeFileSync(vkeyFile, JSON.stringify(vKey, null, 2));
            console.log("Verification key generated");
        }

        // Generate the proof
        console.log("Creating proof...");
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            JSON.parse(fs.readFileSync(path.join(__dirname, "../build/doc_input.json"))),
            path.join(__dirname, "../build/document_verify.wasm"),
            pkeyFile
        );

        // Save proof and public signals
        const proofFile = path.join(__dirname, "../build/doc_proof.json");
        const publicFile = path.join(__dirname, "../build/doc_public.json");

        fs.writeFileSync(proofFile, JSON.stringify(proof, null, 2));
        fs.writeFileSync(publicFile, JSON.stringify(publicSignals, null, 2));

        console.log("ZK proof generated successfully!");
        console.log(`Proof saved: ${proofFile}`);
        console.log(`Public signals: ${publicFile}`);

        // Convert proof to contract format
        const solidityProof = {
            a: [proof.pi_a[0], proof.pi_a[1]],
            b: [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]],
            c: [proof.pi_c[0], proof.pi_c[1]],
            publicSignals: publicSignals
        };

        const solidityFile = path.join(__dirname, "../build/doc_solidity_proof.json");
        fs.writeFileSync(solidityFile, JSON.stringify(solidityProof, null, 2));
        console.log(`Solidity format: ${solidityFile}`);

        // Show proof details
        console.log("\nProof Details:");
        console.log("==============");
        console.log(`Document verification result: ${publicSignals[0] === "1" ? "VALID" : "INVALID"}`);
        console.log(`Public signals: [${publicSignals.join(", ")}]`);

        return true;

    } catch (error) {
        console.error("Error generating document proof:", error.message);
        return false;
    }
}

// CLI usage
if (require.main === module) {
    console.log("ZK Proof - Document Verification Proof Generation");
    console.log("===============================================");

    generateDocumentProof().then(success => {
        if (success) {
            console.log("\nDocument proof ready for blockchain submission!");
            console.log("Next step: npm run verify-doc-proof");
        } else {
            console.log("\nFailed to generate document proof");
            process.exit(1);
        }
    });
}

module.exports = { generateDocumentProof };