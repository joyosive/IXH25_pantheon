const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

async function generateDocumentWitness(qualification, experience, documentData) {
    try {
        console.log("Generating witness for document verification...");

        const input = {
            qualification: qualification,
            experience: experience,
            minQualification: 70,      // Default minimum 70%
            minExperience: 2           // Default minimum 2 years
        };

        console.log(`Input: qualification=${input.qualification}, experience=${input.experience}`);
        console.log(`Requirements: minQual=${input.minQualification}, minExp=${input.minExperience}`);

        await snarkjs.wtns.calculate(
            input,
            path.join(__dirname, "../build/document_verify.wasm"),
            path.join(__dirname, "../build/doc_witness.wtns")
        );

        const witnessFile = path.join(__dirname, "../build/doc_witness.wtns");

        if (fs.existsSync(witnessFile)) {
            console.log("Document witness generated successfully!");
            console.log(`Saved to: ${witnessFile}`);

            // Load and export witness as JSON for inspection
            const witness = await snarkjs.wtns.exportJson(witnessFile);
            const witnessJson = path.join(__dirname, "../build/doc_witness.json");
            fs.writeFileSync(witnessJson, JSON.stringify(witness, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value, 2));
            console.log(`Witness JSON: ${witnessJson}`);

            // Save input for proof generation
            const inputJson = path.join(__dirname, "../build/doc_input.json");
            fs.writeFileSync(inputJson, JSON.stringify(input, null, 2));
            console.log(`Input saved: ${inputJson}`);

            return true;
        } else {
            throw new Error("Witness file was not created");
        }

    } catch (error) {
        console.error("Error generating document witness:", error.message);
        return false;
    }
}

// CLI usage
if (require.main === module) {
    const qualification = process.argv[2] ? parseInt(process.argv[2]) : 85; // Default qualification 85%
    const experience = process.argv[3] ? parseInt(process.argv[3]) : 5;     // Default experience 5 years
    const documentData = process.argv[4] || "John Doe - Computer Science Degree - University XYZ - 2020";

    console.log("ZK Proof - Document Verification Witness Generation");
    console.log("================================================");

    generateDocumentWitness(qualification, experience, documentData).then(success => {
        if (success) {
            console.log("\nReady to generate document proof!");
            console.log("Next step: npm run generate-doc-proof");
        } else {
            console.log("\nFailed to generate document witness");
            process.exit(1);
        }
    });
}

module.exports = { generateDocumentWitness };