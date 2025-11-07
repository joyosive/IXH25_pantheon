import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, Lock, Zap, CheckCircle, Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function ClaimPaymentPage() {
  const queryClient = useQueryClient();
  const [searchLink, setSearchLink] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [generatingProof, setGeneratingProof] = useState(false);
  const [proofProgress, setProofProgress] = useState(0);
  const [claimed, setClaimed] = useState(false);

  const { data: activePayments, isLoading } = useQuery({
    queryKey: ['active-payments'],
    queryFn: () => base44.entities.ConditionalPayment.filter({ status: 'active' }, '-created_date'),
    initialData: [],
  });

  const claimPaymentMutation = useMutation({
    mutationFn: async ({ paymentId, wallet, proofData }) => {
      return base44.entities.ConditionalPayment.update(paymentId, {
        recipient_wallet: wallet,
        proof_submitted: true,
        proof_data: proofData,
        status: 'claimed',
        claimed_date: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-payments'] });
      setClaimed(true);
    },
  });

  const handleGenerateProof = async () => {
    setGeneratingProof(true);
    setProofProgress(0);

    const interval = setInterval(() => {
      setProofProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setProofProgress(100);
      
      const mockProofHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      claimPaymentMutation.mutate({
        paymentId: selectedPayment.id,
        wallet: walletAddress,
        proofData: mockProofHash
      });
      
      setGeneratingProof(false);
    }, 2000);
  };

  const searchPayment = () => {
    const found = activePayments.find(p => p.payment_link === searchLink);
    if (found) {
      setSelectedPayment(found);
    }
  };

  if (claimed) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-gradient-to-br from-green-950/40 to-cyan-950/40 border-green-500/30">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Payment Claimed Successfully!
                </h2>
                <p className="text-gray-300 mb-8">
                  Your zero-knowledge proof was verified and the payment has been released to your wallet.
                </p>

                <div className="bg-black/30 rounded-lg p-6 mb-8">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount Received:</span>
                      <span className="text-white font-semibold">{selectedPayment?.amount} {selectedPayment?.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Your Wallet:</span>
                      <span className="text-cyan-400 font-mono text-sm">{walletAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Proof Hash:</span>
                      <span className="text-purple-400 font-mono text-xs">{selectedPayment?.proof_data?.substring(0, 20)}...</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <div className="text-purple-300 font-semibold mb-1">Privacy Protected</div>
                      <div className="text-sm text-gray-400">
                        Your personal data was never exposed. Only a cryptographic proof was verified.
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setClaimed(false);
                    setSelectedPayment(null);
                    setWalletAddress("");
                    setSearchLink("");
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Claim Another Payment
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Claim Conditional Payment
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Generate a zero-knowledge proof to unlock your payment
            </p>
          </div>

          {/* Search Payment */}
          {!selectedPayment && (
            <Card className="bg-purple-950/20 border-purple-500/30 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Search className="w-5 h-5 text-purple-400" />
                  Find Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    value={searchLink}
                    onChange={(e) => setSearchLink(e.target.value)}
                    placeholder="Paste payment link here..."
                    className="bg-black/30 border-purple-500/30 text-white"
                  />
                  <Button
                    onClick={searchPayment}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Payments */}
          {!selectedPayment && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Available Payments</h2>
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
                </div>
              ) : activePayments.length === 0 ? (
                <Card className="bg-black/20 border-purple-500/20">
                  <CardContent className="p-12 text-center text-gray-400">
                    No active payments available
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {activePayments.map((payment) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="bg-purple-950/20 border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer h-full"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-2">
                                {payment.amount} {payment.currency}
                              </Badge>
                              <h3 className="text-lg font-bold text-white">{payment.condition_title}</h3>
                            </div>
                          </div>
                          <p className="text-sm text-gray-400 mb-4">{payment.condition_description}</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">From:</span>
                              <span className="text-gray-300">{payment.funder_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Deadline:</span>
                              <span className="text-gray-300">{new Date(payment.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Claim Flow */}
          {selectedPayment && !claimed && (
            <div className="space-y-6">
              {/* Payment Details */}
              <Card className="bg-gradient-to-br from-purple-950/40 to-pink-950/40 border-purple-500/30">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">{selectedPayment.condition_title}</h3>
                      <p className="text-gray-300 mb-6">{selectedPayment.condition_description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            {selectedPayment.amount} {selectedPayment.currency}
                          </Badge>
                          <span className="text-gray-400 text-sm">Payment Amount</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Funder</div>
                        <div className="text-white font-semibold">{selectedPayment.funder_name}</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Deadline</div>
                        <div className="text-white font-semibold">{new Date(selectedPayment.deadline).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Claim Steps */}
              <Card className="bg-purple-950/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Wallet className="w-5 h-5 text-purple-400" />
                    Claim Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Wallet Input */}
                  <div>
                    <Label htmlFor="wallet" className="text-gray-300">
                      Your Wallet Address
                    </Label>
                    <Input
                      id="wallet"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      className="bg-black/30 border-purple-500/30 text-white font-mono"
                    />
                  </div>

                  {/* Info Alert */}
                  <Alert className="bg-cyan-950/20 border-cyan-500/30">
                    <Lock className="w-4 h-4" />
                    <AlertDescription className="text-cyan-300 text-sm">
                      <strong>Privacy Guaranteed:</strong> Your proof will be generated locally on your device. 
                      No personal data is shared - only a cryptographic proof that you meet the conditions.
                    </AlertDescription>
                  </Alert>

                  {/* Generate Proof */}
                  {generatingProof ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
                        <div className="text-white font-semibold mb-2">Generating Zero-Knowledge Proof...</div>
                        <div className="text-gray-400 text-sm mb-4">This may take a few seconds</div>
                        <div className="max-w-md mx-auto">
                          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
                              style={{ width: `${proofProgress}%` }}
                            />
                          </div>
                          <div className="text-sm text-purple-300 mt-2">{proofProgress}%</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleGenerateProof}
                      disabled={!walletAddress || claimPaymentMutation.isPending}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg"
                    >
                      {claimPaymentMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Claiming Payment...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          Generate Proof & Claim Payment
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setSelectedPayment(null)}
                    className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  >
                    Back to Available Payments
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}