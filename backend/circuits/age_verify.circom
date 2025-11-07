template AgeVerification() {
    signal input age;
    signal input minAge;
    signal output isValid;

    component isGreater = GreaterEqualThan(8);
    isGreater.in[0] <== age;
    isGreater.in[1] <== minAge;

    isValid <== isGreater.out;
}

template GreaterEqualThan(n) {
    signal input in[2];
    signal output out;

    component lt = LessThan(n);
    lt.in[0] <== in[1];
    lt.in[1] <== in[0] + 1;

    out <== lt.out;
}

template LessThan(n) {
    signal input in[2];
    signal output out;

    component bits = Num2Bits(n);
    bits.in <== in[0] + (1 << (n-1)) - in[1];

    out <== 1 - bits.out[n-1];
}

template Num2Bits(n) {
    signal input in;
    signal output out[n];
    var lc1=0;

    for (var i = 0; i<n; i++) {
        out[i] <-- (in >> i) & 1;
        out[i] * (out[i] -1 ) === 0;
        lc1 = lc1 + out[i] * (1<<i);
    }

    lc1 === in;
}

component main = AgeVerification();