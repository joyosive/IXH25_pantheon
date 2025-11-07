import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Globe, Briefcase, Coins, Building, Heart, Leaf, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function UseCasesPage() {
  const useCases = [
    {
      icon: GraduationCap,
      category: "Education & Credentialing",
      color: "blue",
      title: "Scholarships & Tuition Reimbursement",
      problem: "Students must share transcripts, grades, enrollment records with multiple parties. Privacy leaked, bureaucracy heavy.",
      solution: "Prove course completion without sharing grades, identity, or enrollment data.",
      examples: [
        "Scholarship disbursements based on course completion",
        "Tuition reimbursements from employers",
        "Skills-based hiring with credential verification",
        "Certification-gated learning rewards"
      ],
      metrics: {
        timeSaved: "2-3 weeks → 3 seconds",
        costReduction: "$50-100 → $0.01",
        privacyGain: "100% data protection"
      }
    },
    {
      icon: Globe,
      category: "Impact & ESG Finance",
      color: "green",
      title: "Climate & Humanitarian Funding",
      problem: "How to verify 10,000 trees planted without flying auditors or trusting photos? High cost, low trust.",
      solution: "Prove impact metrics achieved without revealing operational data or exact locations.",
      examples: [
        "Carbon credit verification",
        "Tree planting project milestones",
        "Clean water initiative funding",
        "Renewable energy development grants"
      ],
      metrics: {
        timeSaved: "Months → Minutes",
        costReduction: "Audit costs eliminated",
        privacyGain: "Protect site locations"
      }
    },
    {
      icon: Briefcase,
      category: "Enterprise & Freelancing",
      color: "purple",
      title: "Milestone-Based Contractor Payments",
      problem: "Contractors must expose proprietary methods and detailed progress reports. IP exposure, trust friction.",
      solution: "Prove work completion without exposing proprietary methods or code.",
      examples: [
        "Software development milestones",
        "Design project deliverables",
        "Research & development phases",
        "Performance-based bonuses"
      ],
      metrics: {
        timeSaved: "Weekly reviews → Instant",
        costReduction: "Management overhead cut 80%",
        privacyGain: "IP fully protected"
      }
    },
    {
      icon: Heart,
      category: "Cross-Border Aid",
      color: "pink",
      title: "Emergency Relief Distribution",
      problem: "Need to verify recipient eligibility without collecting sensitive documents. Identity theft risk, delays.",
      solution: "Prove eligibility (refugee status, income level) without exposing identity documents.",
      examples: [
        "Disaster relief fund distribution",
        "Refugee assistance programs",
        "Medical aid for underserved communities",
        "Food security programs"
      ],
      metrics: {
        timeSaved: "Days → Seconds",
        costReduction: "Admin costs 90% lower",
        privacyGain: "Zero document exposure"
      }
    },
    {
      icon: Coins,
      category: "DeFi & DAOs",
      color: "yellow",
      title: "Trustless Treasury Management",
      problem: "DAOs struggle with verifying contributor work and impact metrics before releasing funds.",
      solution: "Automated treasury disbursements based on cryptographic proof of contribution.",
      examples: [
        "Contributor bounties and grants",
        "Governance-backed milestone payments",
        "Protocol development funding",
        "Community initiative rewards"
      ],
      metrics: {
        timeSaved: "Governance votes reduced",
        costReduction: "No multisig overhead",
        privacyGain: "Pseudonymous contributions"
      }
    },
    {
      icon: Building,
      category: "Enterprise Compliance",
      color: "indigo",
      title: "Compliance-Gated Transactions",
      problem: "Companies must verify compliance (licenses, certifications) while protecting sensitive business data.",
      solution: "Prove regulatory compliance without exposing business operations or financials.",
      examples: [
        "Supply chain payment verification",
        "Regulatory compliance payments",
        "Vendor qualification gates",
        "Insurance claim processing"
      ],
      metrics: {
        timeSaved: "Compliance checks automated",
        costReduction: "Legal review costs cut",
        privacyGain: "Business data protected"
      }
    },
    {
      icon: Leaf,
      category: "Sustainability",
      color: "teal",
      title: "ESG Impact Verification",
      problem: "Organizations need to prove ESG metrics for funding without revealing competitive strategies.",
      solution: "Verify environmental/social impact achievements while protecting operational details.",
      examples: [
        "Sustainable sourcing verification",
        "Carbon footprint milestone payments",
        "Diversity hiring incentives",
        "Circular economy grants"
      ],
      metrics: {
        timeSaved: "Quarterly reports → Real-time",
        costReduction: "Third-party audits eliminated",
        privacyGain: "Strategy confidentiality"
      }
    },
    {
      icon: Trophy,
      category: "Gaming & Rewards",
      color: "orange",
      title: "Achievement-Based Rewards",
      problem: "Gaming platforms and reward programs struggle with fraud while maintaining player privacy.",
      solution: "Prove in-game achievements or loyalty milestones without exposing player data.",
      examples: [
        "Gaming tournament prizes",
        "Loyalty program tier upgrades",
        "Skill-based competition payouts",
        "Educational gamification rewards"
      ],
      metrics: {
        timeSaved: "Instant verification",
        costReduction: "Anti-fraud costs reduced",
        privacyGain: "Player data protected"
      }
    }
  ];

  const colorMap = {
    blue: { bg: "bg-blue-950/20", border: "border-blue-500/30", text: "text-blue-300", gradient: "from-blue-500 to-blue-600" },
    green: { bg: "bg-green-950/20", border: "border-green-500/30", text: "text-green-300", gradient: "from-green-500 to-green-600" },
    purple: { bg: "bg-purple-950/20", border: "border-purple-500/30", text: "text-purple-300", gradient: "from-purple-500 to-purple-600" },
    pink: { bg: "bg-pink-950/20", border: "border-pink-500/30", text: "text-pink-300", gradient: "from-pink-500 to-pink-600" },
    yellow: { bg: "bg-yellow-950/20", border: "border-yellow-500/30", text: "text-yellow-300", gradient: "from-yellow-500 to-yellow-600" },
    indigo: { bg: "bg-indigo-950/20", border: "border-indigo-500/30", text: "text-indigo-300", gradient: "from-indigo-500 to-indigo-600" },
    teal: { bg: "bg-teal-950/20", border: "border-teal-500/30", text: "text-teal-300", gradient: "from-teal-500 to-teal-600" },
    orange: { bg: "bg-orange-950/20", border: "border-orange-500/30", text: "text-orange-300", gradient: "from-orange-500 to-orange-600" }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Real-World Use Cases
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From education to climate action, ZKProofPay transforms how conditional payments work across industries
          </p>
        </motion.div>

        {/* Market Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border-purple-500/30">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">$701B</div>
                  <div className="text-gray-400">Digital Payments Market by 2034</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">$10B</div>
                  <div className="text-gray-400">ZK Proof Market by 2030</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">90B+</div>
                  <div className="text-gray-400">Proofs needed for Web3 by 2030</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => {
            const colors = colorMap[useCase.color];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${colors.bg} ${colors.border} hover:scale-105 transition-transform h-full`}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0`}>
                        <useCase.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <Badge className={`${colors.bg} ${colors.text} border-${useCase.color}-500/30 mb-2`}>
                          {useCase.category}
                        </Badge>
                        <CardTitle className="text-xl text-white">{useCase.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Problem */}
                    <div>
                      <div className="text-sm font-semibold text-red-300 mb-2">❌ The Problem</div>
                      <p className="text-sm text-gray-400">{useCase.problem}</p>
                    </div>

                    {/* Solution */}
                    <div>
                      <div className="text-sm font-semibold text-green-300 mb-2">✓ ZKProofPay Solution</div>
                      <p className="text-sm text-gray-300 font-medium">{useCase.solution}</p>
                    </div>

                    {/* Examples */}
                    <div>
                      <div className="text-sm font-semibold text-gray-300 mb-2">Examples:</div>
                      <ul className="space-y-1">
                        {useCase.examples.map((example, i) => (
                          <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                            <span className={colors.text}>•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Metrics */}
                    <div className={`p-4 rounded-lg bg-gradient-to-br from-${useCase.color}-500/10 to-${useCase.color}-600/5 border border-${useCase.color}-500/20`}>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className={`text-xs ${colors.text} mb-1`}>Time</div>
                          <div className="text-xs text-white font-semibold">{useCase.metrics.timeSaved}</div>
                        </div>
                        <div>
                          <div className={`text-xs ${colors.text} mb-1`}>Cost</div>
                          <div className="text-xs text-white font-semibold">{useCase.metrics.costReduction}</div>
                        </div>
                        <div>
                          <div className={`text-xs ${colors.text} mb-1`}>Privacy</div>
                          <div className="text-xs text-white font-semibold">{useCase.metrics.privacyGain}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}