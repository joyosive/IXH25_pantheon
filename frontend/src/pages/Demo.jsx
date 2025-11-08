import React, { useState, useEffect } from "react";
import { useAccount } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Shield, CheckCircle, AlertTriangle, Loader2, Zap, User, GraduationCap, Award, Sparkles, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function DemoPage() {
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    degree: "Bachelor's",
    major: "",
    yearsOfEducation: 4,
    gpa: 3.5,
    graduationYear: 2024,
    academicTranscript: "",
    bankStatement: ""
  });
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [zkProof, setZkProof] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const steps = [
    { title: "Apply for Scholarship", icon: User, desc: "Enter your academic details" },
    { title: "Generate ZK Proof", icon: Shield, desc: "Create privacy-preserving proof" },
    { title: "Submit to Blockchain", icon: Zap, desc: "Verify on XRPL EVM" },
    { title: "Application Submitted", icon: Award, desc: "Results pending" }
  ];

  const generateProof = async () => {
    setIsGeneratingProof(true);

    // Simulate proof generation with academic validation
    setTimeout(() => {
      const hasValidGPA = formData.gpa >= 3.4;
      const hasMinEducation = formData.yearsOfEducation >= 4;
      const hasRequiredFields = formData.name && formData.university && formData.major && formData.academicTranscript;
      const isEligible = hasValidGPA && hasMinEducation && hasRequiredFields;

      const mockProof = {
        a: ["0x1a2b3c4d...ef56789a", "0x9876543b...ab123cde"],
        b: [["0xfedcba98...12345678", "0x87654321...abcdefab"], ["0x13579bdf...2468ace0", "0xfdb97531...8642eca9"]],
        c: ["0xabcdef12...87654321", "0x24681357...9bdfeca0"],
        publicSignals: [isEligible ? "1" : "0"],
        metadata: {
          scholarshipEligible: isEligible,
          minimumGPA: 3.4,
          requiredYears: 4,
          academicStanding: hasValidGPA
        }
      };

      setZkProof(mockProof);
      setIsGeneratingProof(false);
      setStep(3);
    }, 3000);
  };

  const submitProof = async () => {
    setIsSubmittingProof(true);

    // Simulate blockchain submission
    setTimeout(() => {
      setIsSubmittingProof(false);
      setIsVerified(true);
      setStep(4);
    }, 2000);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative">
              <Shield className="w-20 h-20 mx-auto text-purple-400 glow-text mb-6" />
              <h1 className="text-4xl font-bold text-white mb-4 glow-text">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Scholarship Demo
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Connect your wallet to experience privacy-preserving scholarship applications
              </p>

              <Card className="bg-purple-950/20 border-purple-500/30 glow-border">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-300">Connect MetaMask to continue</span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>• Your academic records stay completely private</p>
                      <p>• Only eligibility is proven, not actual grades</p>
                      <p>• Scholarship decisions are bias-free</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Zero-Knowledge Scholarship Application</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 glow-text">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Privacy-First
            </span>
            <br />
            <span className="text-white">Education Funding</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Apply for scholarships without revealing personal academic data. Prove you qualify without showing your grades.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((stepInfo, index) => {
              const stepNumber = index + 1;
              const isActive = step === stepNumber;
              const isCompleted = step > stepNumber;
              const StepIcon = stepInfo.icon;

              return (
                <div key={stepNumber} className="flex items-center">
                  <div className={`flex flex-col items-center ${index > 0 ? 'ml-4' : ''}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500 text-green-400 glow-border'
                        : isActive
                        ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500 text-purple-400 glow-border'
                        : 'bg-gray-500/20 border-gray-500 text-gray-400'
                    }`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-purple-300' : isCompleted ? 'text-green-300' : 'text-gray-400'
                      }`}>
                        {stepInfo.title}
                      </div>
                      <div className="text-xs text-gray-500">{stepInfo.desc}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-600'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl mx-auto"
        >
          {step === 1 && (
            <Card className="bg-purple-950/20 border-purple-500/30 glow-border backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  Scholarship Application
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your academic information. This data will be used to generate your zero-knowledge proof.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full legal name"
                      className="bg-black/20 border-purple-500/30 text-white placeholder-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-white">University/Institution</Label>
                    <Input
                      id="university"
                      value={formData.university}
                      onChange={(e) => setFormData({...formData, university: e.target.value})}
                      placeholder="Harvard University, MIT, etc."
                      className="bg-black/20 border-purple-500/30 text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="degree" className="text-white">Degree Level</Label>
                    <select
                      id="degree"
                      value={formData.degree}
                      onChange={(e) => setFormData({...formData, degree: e.target.value})}
                      className="w-full bg-black/20 border border-purple-500/30 text-white rounded-md px-3 py-2"
                    >
                      <option value="Bachelor's">Bachelor's Degree</option>
                      <option value="Master's">Master's Degree</option>
                      <option value="PhD">PhD</option>
                      <option value="Associate">Associate Degree</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="major" className="text-white">Major/Field of Study</Label>
                    <Input
                      id="major"
                      value={formData.major}
                      onChange={(e) => setFormData({...formData, major: e.target.value})}
                      placeholder="Computer Science, Engineering, etc."
                      className="bg-black/20 border-purple-500/30 text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfEducation" className="text-white">Years of Prior Education</Label>
                    <Input
                      id="yearsOfEducation"
                      type="number"
                      value={formData.yearsOfEducation}
                      onChange={(e) => setFormData({...formData, yearsOfEducation: parseInt(e.target.value)})}
                      min="1"
                      max="10"
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                    <p className="text-xs text-gray-400">Minimum: 4 years</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpa" className="text-white">GPA (4.0 scale)</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.1"
                      value={formData.gpa}
                      onChange={(e) => setFormData({...formData, gpa: parseFloat(e.target.value)})}
                      min="0"
                      max="4.0"
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                    <p className="text-xs text-gray-400">Must be ≥ 3.4</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduationYear" className="text-white">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({...formData, graduationYear: parseInt(e.target.value)})}
                      min="2020"
                      max="2030"
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Required Document Links</h4>

                  <div className="space-y-2">
                    <Label htmlFor="academicTranscript" className="text-white">Official Academic Transcript</Label>
                    <Input
                      id="academicTranscript"
                      value={formData.academicTranscript}
                      onChange={(e) => setFormData({...formData, academicTranscript: e.target.value})}
                      placeholder="https://registrar.university.edu/transcript/..."
                      className="bg-black/20 border-purple-500/30 text-white placeholder-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankStatement" className="text-white">Financial Need Verification</Label>
                    <Input
                      id="bankStatement"
                      value={formData.bankStatement}
                      onChange={(e) => setFormData({...formData, bankStatement: e.target.value})}
                      placeholder="Bank statements or financial aid documents"
                      className="bg-black/20 border-purple-500/30 text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  {formData.name && formData.university && formData.major && formData.gpa >= 3.4 && formData.yearsOfEducation >= 4 && formData.academicTranscript ? (
                    <Badge className="w-full justify-center py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Eligible for Scholarship
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="w-full justify-center py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Requirements: GPA ≥ 3.4, 4+ years education, all fields required
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 glow-border"
                  disabled={!formData.name || !formData.university || !formData.major || formData.gpa < 3.4 || formData.yearsOfEducation < 4 || !formData.academicTranscript}
                >
                  Continue to Zero-Knowledge Proof
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="bg-purple-950/20 border-purple-500/30 glow-border backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Generate Zero-Knowledge Proof
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Creating a mathematical proof that validates your eligibility without revealing your actual GPA or personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-black/20 rounded-lg p-4 space-y-3">
                  <h4 className="text-white font-medium">What gets proven (without revealing):</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Identity Verification:</span>
                      <span className="text-green-300">✓ Valid government ID</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Academic Standing:</span>
                      <span className="text-green-300">✓ Transcript verified</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Financial Need:</span>
                      <span className="text-green-300">✓ Income requirements met</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-950/20 to-blue-950/20 border border-cyan-500/30 rounded-lg p-4">
                  <h4 className="text-cyan-300 font-medium mb-2">Privacy Guarantee</h4>
                  <p className="text-sm text-gray-400">
                    Your sensitive academic data (exact GPA: {formData.gpa}, transcript details, financial information)
                    remain completely private. Only eligibility proof is generated.
                  </p>
                </div>

                {!isGeneratingProof && !zkProof && (
                  <Button
                    onClick={generateProof}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 glow-border"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Generate ZK Proof
                  </Button>
                )}

                {isGeneratingProof && (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400 mb-4" />
                    <p className="text-white font-medium">Generating Zero-Knowledge Proof...</p>
                    <div className="mt-4 space-y-2 text-sm text-gray-400">
                      <p>• Computing cryptographic circuits...</p>
                      <p>• Generating witness data...</p>
                      <p>• Creating proof without revealing inputs...</p>
                    </div>
                  </div>
                )}

                {zkProof && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-950/20 to-emerald-950/20 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">ZK Proof Generated Successfully!</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Proof confirms scholarship eligibility while keeping all personal data private
                      </p>
                    </div>

                    <Button
                      onClick={() => setStep(3)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 glow-border"
                    >
                      Submit to XRPL Blockchain
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="bg-purple-950/20 border-purple-500/30 glow-border backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Submit to XRPL EVM Chain
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your proof will be verified on XRPL EVM and registered for scholarship consideration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400">Connected Wallet:</span>
                    <span className="text-purple-300 font-mono text-sm">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-cyan-300">XRPL EVM Chain</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-medium">Submission Process:</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• ZK proof generated</li>
                    <li>• Eligibility recorded on immutable ledger</li>
                  </ul>
                </div>

                {!isSubmittingProof && !isVerified && (
                  <Button
                    onClick={submitProof}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 glow-border"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Submit to Blockchain
                  </Button>
                )}

                {isSubmittingProof && (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400 mb-4" />
                    <p className="text-white font-medium">Submitting to XRPL EVM...</p>
                    <p className="text-sm text-gray-400 mt-2">Verifying proof on-chain...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border-blue-500/30 glow-border backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Award className="w-5 h-5 text-blue-400" />
                  Scholarship Application Submitted
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your application has been submitted successfully with privacy protection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mx-auto mb-6"
                  >
                    <Award className="w-20 h-20 text-blue-400 glow-text" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-blue-300 mb-2 glow-text">Application in Queue</h3>
                  <p className="text-gray-300">
                    You have successfully submitted your scholarship application without revealing any personal data.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-green-400 font-bold text-xl">✓</div>
                    <div className="text-sm text-gray-300">Privacy Protected</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-green-400 font-bold text-xl">✓</div>
                    <div className="text-sm text-gray-300">Blockchain Verified</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-950/30 to-pink-950/30 rounded-lg p-6 text-center">
                  <h4 className="text-purple-300 font-medium mb-2">📋 What's Next?</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Funding decisions will be made transparently using your verified eligibility
                    without ever exposing your personal information.
                  </p>
                  <div className="text-xs text-yellow-300">
                    Expected funding notification: 5-8 business days
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

      </div>
    </div>
  );
}