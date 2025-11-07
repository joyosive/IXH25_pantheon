import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock, Zap, Shield, User, Building, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
  const journey = [
    {
      step: 1,
      actor: "Foundation",
      icon: Building,
      color: "purple",
      title: "Creates Conditional Payment",
      actions: [
        "Sets condition: 'Completed Blockchain Developer Course'",
        "Locks $500 XRP in smart contract",
        "Sets 30-day deadline",
        "Receives shareable payment link"
      ],
      time: "2 minutes",
      highlight: "Funds secured in escrow on XRPL EVM"
    },
    {
      step: 2,
      actor: "Maria",
      icon: User,
      color: "pink",
      title: "Receives Opportunity",
      actions: [
        "Gets notification about scholarship",
        "Clicks payment claim link",
        "Sees: $500 XRP available",
        "Required: Zero-knowledge proof (data stays private)"
      ],
      time: "Instant",
      highlight: "No personal data required yet"
    },
    {
      step: 3,
      actor: "Maria",
      icon: Lock,
      color: "cyan",
      title: "Generates ZK Proof (The Magic)",
      actions: [
        "Clicks 'Generate Proof'",
        "Connects to course platform securely",
        "Platform confirms completion locally",
        "ZK circuit generates cryptographic proof"
      ],
      private: [
        "Maria's completion certificate",
        "Course ID and completion date",
        "Identity credentials"
      ],
      public: "Cryptographic proof: 'Someone met requirements' ✓",
      time: "30 seconds",
      highlight: "ZERO personal data shared - proof generated on Maria's device"
    },
    {
      step: 4,
      actor: "Smart Contract",
      icon: Shield,
      color: "green",
      title: "Verifies & Releases Payment",
      actions: [
        "Receives proof on XRPL EVM",
        "Verifies proof mathematically",
        "Validation passes ✓",
        "Automatically releases $500 XRP",
        "Transaction confirmed on XRPL"
      ],
      time: "3 seconds",
      highlight: "Trustless verification - no human intervention"
    }
  ];

  const comparison = {
    traditional: [
      { item: "Share personal data", icon: Eye, bad: true },
      { item: "Manual verification", icon: User, bad: true },
      { item: "2-3 weeks processing", icon: Zap, bad: true },
      { item: "High staff costs ($50-100)", icon: Building, bad: true },
      { item: "Privacy compromised", icon: Lock, bad: true }
    ],
    zkproofpay: [
      { item: "Zero data exposure", icon: EyeOff, bad: false },
      { item: "Automated verification", icon: Shield, bad: false },
      { item: "3 seconds settlement", icon: Zap, bad: false },
      { item: "~$0.01 transaction fee", icon: CheckCircle, bad: false },
      { item: "Complete privacy", icon: Lock, bad: false }
    ]
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
              How It Works
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Follow Maria's journey from scholarship notification to instant payment - 
            all while keeping her data completely private
          </p>
        </motion.div>

        {/* The Story */}
        <div className="mb-20">
          <Card className="bg-purple-950/20 border-purple-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-300">The Story: Maria's Scholarship</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p className="mb-4">
                Maria just completed an online blockchain development course in Brazil. 
                The TechFuture Foundation offers $500 scholarships to course completers.
              </p>
              <p className="text-lg font-semibold text-white">
                Watch how ZKProofPay makes this instant, private, and trustless.
              </p>
            </CardContent>
          </Card>

          {/* Journey Steps */}
          <div className="space-y-12">
            {journey.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <Card className={`bg-${step.color}-950/20 border-${step.color}-500/30 hover:border-${step.color}-500/50 transition-all`}>
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Step Number & Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 flex items-center justify-center mb-4`}>
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <Badge className={`bg-${step.color}-500/20 text-${step.color}-300 border-${step.color}-500/30`}>
                          Step {step.step}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">{step.actor}</div>
                            <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                          </div>
                          <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                            {step.time}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 mb-4">
                          {step.actions.map((action, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
                              <span className="text-gray-300">{action}</span>
                            </div>
                          ))}
                        </div>

                        {/* Special Section for ZK Proof */}
                        {step.private && (
                          <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <Card className="bg-red-950/20 border-red-500/20">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <EyeOff className="w-4 h-4 text-red-400" />
                                  <span className="text-sm font-semibold text-red-300">Private (Never Leaves Device)</span>
                                </div>
                                <ul className="space-y-1 text-sm text-gray-400">
                                  {step.private.map((item, i) => (
                                    <li key={i}>• {item}</li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                            <Card className="bg-green-950/20 border-green-500/20">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <Eye className="w-4 h-4 text-green-400" />
                                  <span className="text-sm font-semibold text-green-300">Public (Sent to Blockchain)</span>
                                </div>
                                <p className="text-sm text-gray-300">{step.public}</p>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Highlight */}
                        <div className={`mt-4 p-4 rounded-lg bg-${step.color}-500/10 border border-${step.color}-500/20`}>
                          <div className="flex items-start gap-2">
                            <CheckCircle className={`w-5 h-5 text-${step.color}-400 flex-shrink-0 mt-0.5`} />
                            <span className={`text-${step.color}-300 font-medium`}>{step.highlight}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Connector Arrow */}
                {index < journey.length - 1 && (
                  <div className="flex justify-center my-6">
                    <ArrowRight className="w-8 h-8 text-purple-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Traditional vs ZKProofPay
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional */}
            <Card className="bg-red-950/20 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-red-300">Traditional Way</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparison.traditional.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-gray-300">{item.item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ZKProofPay */}
            <Card className="bg-green-950/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-green-300">ZKProofPay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparison.zkproofpay.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-gray-300">{item.item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* The Aha Moment */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border-purple-500/30">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                The "Aha!" Moment
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
                Think of proving you're 21+ without showing your ID details. 
                Just a cryptographic proof: "This person meets the requirement."
              </p>
              <p className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                You proved the requirement without revealing the data.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}