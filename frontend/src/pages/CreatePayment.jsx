import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function CreatePaymentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    funder_name: "",
    funder_wallet: "",
    amount: "",
    currency: "XRP",
    condition_type: "",
    condition_title: "",
    condition_description: "",
    deadline: ""
  });
  const [success, setSuccess] = useState(false);
  const [createdPayment, setCreatedPayment] = useState(null);

  const createPaymentMutation = useMutation({
    mutationFn: async (data) => {
      const paymentLink = `zkproofpay.com/claim/${Math.random().toString(36).substr(2, 9)}`;
      return base44.entities.ConditionalPayment.create({
        ...data,
        payment_link: paymentLink,
        status: "active"
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setCreatedPayment(data);
      setSuccess(true);
      setFormData({
        funder_name: "",
        funder_wallet: "",
        amount: "",
        currency: "XRP",
        condition_type: "",
        condition_title: "",
        condition_description: "",
        deadline: ""
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPaymentMutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const conditionTypes = [
    { value: "course_completion", label: "Course Completion" },
    { value: "certification", label: "Certification" },
    { value: "impact_metrics", label: "Impact Metrics" },
    { value: "milestone_completion", label: "Milestone Completion" },
    { value: "eligibility_verification", label: "Eligibility Verification" },
    { value: "custom", label: "Custom Condition" }
  ];

  if (success && createdPayment) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-gradient-to-br from-green-950/40 to-cyan-950/40 border-green-500/30">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Payment Created Successfully!
                </h2>
                <p className="text-gray-300 mb-8">
                  Your conditional payment has been locked in the smart contract. 
                  Share the link below with eligible recipients.
                </p>

                <div className="bg-black/30 rounded-lg p-6 mb-8">
                  <div className="text-sm text-gray-400 mb-2">Payment Details</div>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white font-semibold">{createdPayment.amount} {createdPayment.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Condition:</span>
                      <span className="text-white font-semibold">{createdPayment.condition_title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Deadline:</span>
                      <span className="text-white font-semibold">{new Date(createdPayment.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-4 mb-8">
                  <div className="text-sm text-purple-300 mb-2">Shareable Payment Link</div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/30 px-4 py-2 rounded text-cyan-400 text-sm">
                      {createdPayment.payment_link}
                    </code>
                    <Button
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(createdPayment.payment_link);
                      }}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setSuccess(false);
                      setCreatedPayment(null);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Create Another Payment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(createPageUrl("Dashboard"))}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  >
                    View Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Create Conditional Payment
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Lock funds with zero-knowledge verification requirements
            </p>
          </div>

          <Card className="bg-purple-950/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-white">
                <PlusCircle className="w-6 h-6 text-purple-400" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Funder Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="funder_name" className="text-gray-300">
                      Your Name / Organization
                    </Label>
                    <Input
                      id="funder_name"
                      value={formData.funder_name}
                      onChange={(e) => handleChange("funder_name", e.target.value)}
                      placeholder="e.g., TechFuture Foundation"
                      required
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="funder_wallet" className="text-gray-300">
                      Your Wallet Address
                    </Label>
                    <Input
                      id="funder_wallet"
                      value={formData.funder_wallet}
                      onChange={(e) => handleChange("funder_wallet", e.target.value)}
                      placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      required
                      className="bg-black/30 border-purple-500/30 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Payment Amount */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="amount" className="text-gray-300">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => handleChange("amount", e.target.value)}
                      placeholder="500"
                      required
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency" className="text-gray-300">
                      Currency
                    </Label>
                    <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XRP">XRP</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Condition Type */}
                <div>
                  <Label htmlFor="condition_type" className="text-gray-300">
                    Condition Type
                  </Label>
                  <Select value={formData.condition_type} onValueChange={(value) => handleChange("condition_type", value)} required>
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Select condition type" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition Details */}
                <div>
                  <Label htmlFor="condition_title" className="text-gray-300">
                    Condition Title
                  </Label>
                  <Input
                    id="condition_title"
                    value={formData.condition_title}
                    onChange={(e) => handleChange("condition_title", e.target.value)}
                    placeholder="e.g., Completed Blockchain Developer Course"
                    required
                    className="bg-black/30 border-purple-500/30 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="condition_description" className="text-gray-300">
                    Condition Description
                  </Label>
                  <Textarea
                    id="condition_description"
                    value={formData.condition_description}
                    onChange={(e) => handleChange("condition_description", e.target.value)}
                    placeholder="Detailed description of what needs to be proven..."
                    required
                    rows={4}
                    className="bg-black/30 border-purple-500/30 text-white"
                  />
                </div>

                {/* Deadline */}
                <div>
                  <Label htmlFor="deadline" className="text-gray-300">
                    Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange("deadline", e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-black/30 border-purple-500/30 text-white"
                  />
                </div>

                {/* Info Alert */}
                <Alert className="bg-cyan-950/20 border-cyan-500/30">
                  <AlertDescription className="text-cyan-300 text-sm">
                    Your funds will be locked in a smart contract on XRPL EVM. 
                    They can only be released when a valid zero-knowledge proof is submitted, 
                    or refunded after the deadline expires.
                  </AlertDescription>
                </Alert>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={createPaymentMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg"
                >
                  {createPaymentMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Payment...
                    </>
                  ) : (
                    <>
                      Lock Funds & Create Payment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}