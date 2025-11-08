import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { ZKProofSubmit } from '@/components/ZKProofSubmit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Users, Award, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { CONTRACT_ADDRESSES, GRANT_PROGRAM_ABI } from '@/lib/web3'

export default function ZKProofDemo() {
  const { address, isConnected } = useAccount()
  const [verificationStatus, setVerificationStatus] = useState(null)

  // Check if user is verified
  const { data: isVerified, isLoading: checkingVerification, refetch: refetchVerification } = useReadContract({
    address: CONTRACT_ADDRESSES.GRANT_PROGRAM,
    abi: GRANT_PROGRAM_ABI,
    functionName: 'isVerified',
    args: [address],
    query: {
      enabled: !!address && !!CONTRACT_ADDRESSES.GRANT_PROGRAM,
    }
  })

  useEffect(() => {
    if (isVerified !== undefined) {
      setVerificationStatus(isVerified)
    }
  }, [isVerified])

  const handleVerificationSuccess = () => {
    // Refresh verification status
    setTimeout(() => {
      refetchVerification()
    }, 2000)
  }

  const mockGrants = [
    {
      id: 1,
      title: "Web3 Education Grant",
      description: "Support for blockchain developers learning new technologies",
      amount: "0.5 XRP",
      minQualification: 70,
      minExperience: 2,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      isActive: true,
    },
    {
      id: 2,
      title: "ZK Research Grant",
      description: "Funding for zero-knowledge proof research and development",
      amount: "1.0 XRP",
      minQualification: 80,
      minExperience: 3,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      isActive: true,
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ZKProofPay</h1>
                <p className="text-sm text-gray-500">Privacy-Preserving Grant System</p>
              </div>
            </div>

            {isConnected && (
              <div className="flex items-center gap-4">
                <Badge variant={verificationStatus ? "default" : "outline"}>
                  {verificationStatus ? (
                    <>
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-1 h-3 w-3" />
                      Not Verified
                    </>
                  )}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Private Grant Applications with Zero-Knowledge Proofs
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Prove your qualifications without revealing personal data.
                Apply for grants while maintaining complete privacy.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Privacy First
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your actual qualification scores remain completely private.
                    Only proof of eligibility is revealed.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Fair Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Eliminate unconscious bias by hiding personal details
                    while maintaining verification standards.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    Cryptographically Secure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Using Groth16 zero-knowledge proofs on XRPL EVM
                    for mathematical verification guarantees.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Wallet Connection */}
            <div className="mt-12">
              <WalletConnect />
            </div>
          </div>
        ) : (
          <Tabs defaultValue="verify" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="verify">Verify Identity</TabsTrigger>
              <TabsTrigger value="grants">Browse Grants</TabsTrigger>
              <TabsTrigger value="admin">Admin Panel</TabsTrigger>
            </TabsList>

            <TabsContent value="verify" className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Submit ZK Proof</h3>
                <p className="text-muted-foreground">
                  Prove your qualifications privately using zero-knowledge proofs
                </p>
              </div>

              <ZKProofSubmit onVerificationSuccess={handleVerificationSuccess} />

              {verificationStatus && (
                <Card className="max-w-lg mx-auto bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div>
                        <h4 className="font-semibold text-green-900">Verification Successful!</h4>
                        <p className="text-sm text-green-700">
                          You can now apply for grants that match your qualifications.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="grants" className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Available Grants</h3>
                <p className="text-muted-foreground">
                  Browse and apply for grants using your verified status
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mockGrants.map((grant) => (
                  <Card key={grant.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {grant.title}
                        <Badge variant="outline">{grant.amount}</Badge>
                      </CardTitle>
                      <CardDescription>{grant.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Min Qualification:</span>
                          <p>{grant.minQualification}%</p>
                        </div>
                        <div>
                          <span className="font-medium">Min Experience:</span>
                          <p>{grant.minExperience} years</p>
                        </div>
                        <div>
                          <span className="font-medium">Deadline:</span>
                          <p>{grant.deadline}</p>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <Badge variant={grant.isActive ? "default" : "secondary"}>
                            {grant.isActive ? "Active" : "Closed"}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        disabled={!verificationStatus || !grant.isActive}
                      >
                        {!verificationStatus ? "Verify First" : "Apply for Grant"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!verificationStatus && (
                <Card className="max-w-lg mx-auto bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Shield className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Verification Required</h4>
                        <p className="text-sm text-blue-700">
                          Submit a ZK proof to verify your qualifications and apply for grants.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="admin" className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Grant Administration</h3>
                <p className="text-muted-foreground">
                  Create and manage grants for qualified applicants
                </p>
              </div>

              <Card className="max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle>Coming Soon</CardTitle>
                  <CardDescription>
                    Grant creation and management features will be available in the next update.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm space-y-2">
                      <p>• Create new grants with custom requirements</p>
                      <p>• Review applications from verified users</p>
                      <p>• Automatic fund distribution upon approval</p>
                      <p>• Privacy-preserving applicant selection</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}