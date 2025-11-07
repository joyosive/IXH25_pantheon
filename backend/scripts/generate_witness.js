const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

async function generateWitness(age) {
    try {
        console.log("🔄 Generating witness for age verification...");

        // Input for the circuit
        const input = {
            age: age,           // Private: actual age (will be hidden)
            minAge: 18          // Public: minimum required age
        };

        console.log(`📊 Input: age=${input.age}, minAge=${input.minAge}`);

        // Generate witness
        const { witness } = await snarkjs.wtns.calculate(
            input,
            path.join(__dirname, "../build/age_verify.wasm"),
            path.join(__dirname, "../build/witness.wtns")
        );

        // Read the generated witness
        const witnessFile = path.join(__dirname, "../build/witness.wtns");

        if (fs.existsSync(witnessFile)) {
            console.log("✅ Witness generated successfully!");
            console.log(`📁 Saved to: ${witnessFile}`);

            // Export witness as JSON for inspection
            const witnessJson = path.join(__dirname, "../build/witness.json");
            fs.writeFileSync(witnessJson, JSON.stringify(witness, null, 2));
            console.log(`📄 Witness JSON: ${witnessJson}`);

            return true;
        } else {
            throw new Error("Witness file was not created");
        }

    } catch (error) {
        console.error("❌ Error generating witness:", error.message);
        return false;
    }
}

// CLI usage
if (require.main === module) {
    const age = process.argv[2] ? parseInt(process.argv[2]) : 25; // Default age 25

    console.log("🧮 ZK Proof - Age Verification Witness Generation");
    console.log("================================================");

    generateWitness(age).then(success => {
        if (success) {
            console.log("\n🎉 Ready to generate proof!");
            console.log("Next step: npm run generate-proof");
        } else {
            console.log("\n💥 Failed to generate witness");
            process.exit(1);
        }
    });
}

module.exports = { generateWitness };