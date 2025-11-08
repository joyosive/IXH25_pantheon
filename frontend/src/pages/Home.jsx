import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Zap, Globe, Check, Sparkles, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const problems = [
    "Expose private data to verify conditions",
    "Trust expensive intermediaries",
    "Wait weeks for manual verification",
    "Risk identity theft and data breaches"
  ];

  const solutions = [
    { icon: Shield, title: "Zero Data Exposure", description: "Prove conditions without revealing private information" },
    { icon: Zap, title: "Instant Settlement", description: "Automatic payment release in seconds, not weeks" },
    { icon: Lock, title: "Trustless Verification", description: "Math guarantees compliance, no intermediaries needed" },
    { icon: Globe, title: "XRPL Native", description: "Fast finality, low costs, seamless bridging" }
  ];

  const stats = [
    { value: "$701B", label: "Digital Payments by 2034" },
    { value: "$10B", label: "ZK Proof Market by 2030" },
    { value: "3 sec", label: "Payment Verification Time" },
    { value: "$0.01", label: "Transaction Cost" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">Trustless Conditional Payments on XRPL</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Verify Without
              </span>
              <br />
              <span className="text-white">Revealing</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
              Zero-knowledge proofs enable trustless conditional payments.
              Prove you deserve the payment without showing why you deserve it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 px-8 py-3 text-lg">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The Impossible Choice
            </h2>
            <p className="text-xl text-gray-400">
              Traditional conditional payments force you to choose
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-red-950/20 border-red-500/30">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-red-300 mb-6">Current Reality</h3>
                <div className="space-y-4">
                  {problems.map((problem, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-400 text-lg">✕</span>
                      </div>
                      <p className="text-gray-300">{problem}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-950/20 border-green-500/30">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-green-300 mb-6">With ZKProofPay</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">Complete privacy - zero data exposure</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">Trustless verification - math, not middlemen</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">Instant settlement - seconds, not weeks</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">Cost-effective - pennies, not dollars</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How We Solve It
            </h2>
            <p className="text-xl text-gray-400">
              Zero-knowledge proofs + XRPL-EVM = The future of conditional payments
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-purple-950/20 border-purple-500/30 hover:border-purple-500/50 transition-all hover:scale-105 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                      <solution.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{solution.title}</h3>
                    <p className="text-gray-400">{solution.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to revolutionize payments?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join the future of trustless conditional payments on XRPL
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}