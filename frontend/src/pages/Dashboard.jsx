import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, CheckCircle, Clock, XCircle, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => base44.entities.ConditionalPayment.list('-created_date'),
    initialData: [],
  });

  const stats = {
    total: payments.length,
    active: payments.filter(p => p.status === 'active').length,
    claimed: payments.filter(p => p.status === 'claimed').length,
    expired: payments.filter(p => p.status === 'expired').length,
    totalValue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    claimedValue: payments.filter(p => p.status === 'claimed').reduce((sum, p) => sum + (p.amount || 0), 0)
  };

  const statusConfig = {
    active: { color: "green", icon: Clock, label: "Active" },
    claimed: { color: "blue", icon: CheckCircle, label: "Claimed" },
    expired: { color: "red", icon: XCircle, label: "Expired" },
    refunded: { color: "yellow", icon: TrendingUp, label: "Refunded" }
  };

  const renderPaymentCard = (payment) => {
    const config = statusConfig[payment.status];
    const Icon = config.icon;

    return (
      <motion.div
        key={payment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-purple-950/20 border-purple-500/30 hover:border-purple-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`bg-${config.color}-500/20 text-${config.color}-300 border-${config.color}-500/30`}>
                    {payment.amount} {payment.currency}
                  </Badge>
                  <Badge variant="outline" className={`text-${config.color}-400 border-${config.color}-500/30`}>
                    <Icon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{payment.condition_title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{payment.condition_description}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm border-t border-purple-500/20 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Funder:</span>
                <span className="text-gray-300">{payment.funder_name}</span>
              </div>
              {payment.status === 'claimed' && payment.recipient_wallet && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Recipient:</span>
                  <span className="text-cyan-400 font-mono text-xs">{payment.recipient_wallet.substring(0, 15)}...</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-300">{new Date(payment.created_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deadline:</span>
                <span className="text-gray-300">{new Date(payment.deadline).toLocaleDateString()}</span>
              </div>
              {payment.status === 'claimed' && payment.claimed_date && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Claimed:</span>
                  <span className="text-green-400">{new Date(payment.claimed_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {payment.payment_link && payment.status === 'active' && (
              <div className="mt-4 pt-4 border-t border-purple-500/20">
                <div className="text-xs text-gray-500 mb-1">Payment Link:</div>
                <code className="text-xs bg-black/30 px-2 py-1 rounded text-cyan-400 block truncate">
                  {payment.payment_link}
                </code>
              </div>
            )}

            {payment.proof_data && (
              <div className="mt-4 pt-4 border-t border-purple-500/20">
                <div className="text-xs text-gray-500 mb-1">Proof Hash:</div>
                <code className="text-xs bg-black/30 px-2 py-1 rounded text-purple-400 block truncate">
                  {payment.proof_data}
                </code>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Payment Dashboard
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Track and manage all your conditional payments
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/40 border-purple-500/30">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Payments</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-950/40 to-green-900/40 border-green-500/30">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">{stats.active}</div>
                <div className="text-sm text-gray-400">Active</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/40 border-blue-500/30">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">{stats.claimed}</div>
                <div className="text-sm text-gray-400">Claimed</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/40 border-cyan-500/30">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">{stats.totalValue.toFixed(2)}</div>
                <div className="text-sm text-gray-400">Total XRP</div>
              </CardContent>
            </Card>
          </div>

          {/* Payments List */}
          {isLoading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
              <div className="text-gray-400">Loading payments...</div>
            </div>
          ) : payments.length === 0 ? (
            <Card className="bg-black/20 border-purple-500/20">
              <CardContent className="p-20 text-center">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Payments Yet</h3>
                <p className="text-gray-500">Create your first conditional payment to get started</p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-purple-950/30 mb-8">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
                <TabsTrigger value="claimed">Claimed ({stats.claimed})</TabsTrigger>
                <TabsTrigger value="expired">Expired ({stats.expired})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {payments.map(renderPaymentCard)}
                </div>
              </TabsContent>

              <TabsContent value="active" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {payments.filter(p => p.status === 'active').map(renderPaymentCard)}
                </div>
              </TabsContent>

              <TabsContent value="claimed" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {payments.filter(p => p.status === 'claimed').map(renderPaymentCard)}
                </div>
              </TabsContent>

              <TabsContent value="expired" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {payments.filter(p => p.status === 'expired').map(renderPaymentCard)}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
      </div>
    </div>
  );
}