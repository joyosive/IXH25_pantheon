template DocumentVerification() {
    // Private inputs
    signal input qualification;     // Qualification score (0-100)
    signal input experience;        // Years of experience

    // Public inputs
    signal input minQualification;  // Minimum qualification required
    signal input minExperience;     // Minimum experience required

    // Output
    signal output isValid;          // 1 if eligible, 0 if not

    // Check if qualification >= minQualification
    component qualCheck = GreaterEqualThan(7);
    qualCheck.in[0] <== qualification;
    qualCheck.in[1] <== minQualification;

    // Check if experience >= minExperience
    component expCheck = GreaterEqualThan(5);
    expCheck.in[0] <== experience;
    expCheck.in[1] <== minExperience;

    // Both conditions must be true
    isValid <== qualCheck.out * expCheck.out;

    // Constraint to ensure valid ranges (qualification 0-100)
    component qualRange = LessThan(7);
    qualRange.in[0] <== qualification;
    qualRange.in[1] <== 101;
    qualRange.out === 1;

    // Constraint to ensure valid experience range (0-31 years)
    component expRange = LessThan(5);
    expRange.in[0] <== experience;
    expRange.in[1] <== 32;
    expRange.out === 1;
}

template GreaterEqualThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;

    component lt = LessThan(n+1);

    lt.in[0] <== in[1];
    lt.in[1] <== in[0] + 1;
    out <== lt.out;
}

template LessThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;

    component n2b = Num2Bits(n+1);

    n2b.in <== in[0] + (1<<n) - in[1];

    out <== 1-n2b.out[n];
}

template Num2Bits(n) {
    signal input in;
    signal output out[n];
    var lc1=0;

    var e2=1;
    for (var i = 0; i<n; i++) {
        out[i] <-- (in >> i) & 1;
        out[i] * (out[i] -1 ) === 0;
        lc1 += out[i] * e2;
        e2 = e2+e2;
    }

    lc1 === in;
}

component main = DocumentVerification();