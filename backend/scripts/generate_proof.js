const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

async function generateProof() {
    try {
        console.log("🔐 Generating ZK proof...");

        const witnessFile = path.join(__dirname, "../build/witness.wtns");
        const zkeyFile = path.join(__dirname, "../build/age_verify_final.zkey");

        if (!fs.existsSync(witnessFile)) {
            throw new Error("Witness file not found. Run 'npm run generate-witness' first.");
        }

        if (!fs.existsSync(zkeyFile)) {
            console.log("🔑 zkey file not found. Generating proving key...");
            await setupProvingKey();
        }

        // Generate proof
        console.log("⚡ Creating proof...");
        const { proof, publicSignals } = await snarkjs.groth16.prove(
            zkeyFile,
            witnessFile
        );

        // Save proof
        const proofFile = path.join(__dirname, "../build/proof.json");
        const publicFile = path.join(__dirname, "../build/public.json");

        fs.writeFileSync(proofFile, JSON.stringify(proof, null, 2));
        fs.writeFileSync(publicFile, JSON.stringify(publicSignals, null, 2));

        console.log("✅ Proof generated successfully!");
        console.log(`📁 Proof: ${proofFile}`);
        console.log(`📁 Public signals: ${publicFile}`);

        // Display proof summary
        console.log("\n📊 Proof Summary:");
        console.log("================");
        console.log(`🔍 Public outputs: ${publicSignals}`);
        console.log(`🔐 Proof size: ${JSON.stringify(proof).length} bytes`);

        // Check if age verification passed
        const isValid = publicSignals[0] === "1";
        console.log(`✅ Age verification: ${isValid ? "PASSED" : "FAILED"}`);

        return { proof, publicSignals };

    } catch (error) {
        console.error("❌ Error generating proof:", error.message);
        return null;
    }
}

async function setupProvingKey() {
    try {
        console.log("🔧 Setting up proving key (this may take a moment)...");

        const r1csFile = path.join(__dirname, "../build/age_verify.r1cs");
        if (!fs.existsSync(r1csFile)) {
            throw new Error("Circuit not compiled. Run 'npm run compile-circuits' first.");
        }

        // Phase 1 - Powers of Tau ceremony (using pre-computed for demo)
        console.log("📡 Phase 1: Powers of tau...");
        await snarkjs.powersOfTau.newAccumulator(
            r1csFile,
            path.join(__dirname, "../build/pot12_0000.ptau"),
            12
        );

        await snarkjs.powersOfTau.contribute(
            path.join(__dirname, "../build/pot12_0000.ptau"),
            path.join(__dirname, "../build/pot12_0001.ptau"),
            "demo contribution",
            Math.floor(Math.random() * 1000000)
        );

        await snarkjs.powersOfTau.beacon(
            path.join(__dirname, "../build/pot12_0001.ptau"),
            path.join(__dirname, "../build/pot12_beacon.ptau"),
            "0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20",
            10
        );

        await snarkjs.powersOfTau.prepare(
            path.join(__dirname, "../build/pot12_beacon.ptau"),
            path.join(__dirname, "../build/pot12_final.ptau")
        );

        // Phase 2 - Circuit-specific setup
        console.log("🔧 Phase 2: Circuit-specific setup...");
        await snarkjs.groth16.setup(
            r1csFile,
            path.join(__dirname, "../build/pot12_final.ptau"),
            path.join(__dirname, "../build/age_verify_0000.zkey")
        );

        // Add randomness
        await snarkjs.zKey.contribute(
            path.join(__dirname, "../build/age_verify_0000.zkey"),
            path.join(__dirname, "../build/age_verify_final.zkey"),
            "demo contribution 2",
            Math.floor(Math.random() * 1000000)
        );

        console.log("✅ Proving key setup complete!");

        // Export verification key
        const vKey = await snarkjs.zKey.exportVerificationKey(
            path.join(__dirname, "../build/age_verify_final.zkey")
        );

        fs.writeFileSync(
            path.join(__dirname, "../build/verification_key.json"),
            JSON.stringify(vKey, null, 2)
        );

        console.log("🔑 Verification key exported!");

    } catch (error) {
        console.error("❌ Error setting up proving key:", error.message);
        throw error;
    }
}

// CLI usage
if (require.main === module) {
    console.log("🔐 ZK Proof - Age Verification Proof Generation");
    console.log("===============================================");

    generateProof().then(result => {
        if (result) {
            console.log("\n🎉 Proof ready for verification!");
            console.log("Next step: npm run verify-proof");
        } else {
            console.log("\n💥 Failed to generate proof");
            process.exit(1);
        }
    });
}

module.exports = { generateProof, setupProvingKey };