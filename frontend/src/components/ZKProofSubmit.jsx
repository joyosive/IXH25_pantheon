import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { CONTRACT_ADDRESSES, GRANT_PROGRAM_ABI } from '@/lib/web3'

export function ZKProofSubmit({ onVerificationSuccess }) {
  const { address, isConnected } = useAccount()
  const [proofData, setProofData] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mockProof, setMockProof] = useState({
    qualification: 85,
    experience: 5
  })

  // Mock ZK proof for demo - this would come from the backend
  const sampleProof = {
    a: ["0x1", "0x2"],
    b: [["0x3", "0x4"], ["0x5", "0x6"]],
    c: ["0x7", "0x8"],
    publicSignals: ["1"] // 1 = qualified, 0 = not qualified
  }

  const { writeContract, error, isPending } = useWriteContract()
  const [txHash, setTxHash] = useState(null)

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    onSuccess: () => {
      onVerificationSuccess?.()
    }
  })

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const proof = JSON.parse(e.target.result)
          setProofData(JSON.stringify(proof, null, 2))
        } catch (err) {
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
  }

  const submitProof = async () => {
    if (!isConnected || !CONTRACT_ADDRESSES.GRANT_PROGRAM) {
      alert('Please connect wallet and ensure contract is deployed')
      return
    }

    try {
      let proof
      if (proofData) {
        proof = JSON.parse(proofData)
      } else {
        // Use sample proof for demo
        proof = sampleProof
      }

      const hash = await writeContract({
        address: CONTRACT_ADDRESSES.GRANT_PROGRAM,
        abi: GRANT_PROGRAM_ABI,
        functionName: 'verifyDocuments',
        args: [proof.a, proof.b, proof.c, proof.publicSignals]
      })
      setTxHash(hash)

    } catch (err) {
      console.error('Error submitting proof:', err)
      alert('Error submitting proof: ' + err.message)
    }
  }

  const generateMockProof = () => {
    // Simulate ZK proof generation
    setIsSubmitting(true)
    setTimeout(() => {
      const isQualified = mockProof.qualification >= 70 && mockProof.experience >= 2
      const mockZkProof = {
        ...sampleProof,
        publicSignals: [isQualified ? "1" : "0"],
        // Hidden from contract: actual values
        _hidden: {
          qualification: mockProof.qualification,
          experience: mockProof.experience
        }
      }
      setProofData(JSON.stringify(mockZkProof, null, 2))
      setIsSubmitting(false)
    }, 2000)
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ZK Proof Submission
          </CardTitle>
          <CardDescription>Connect your wallet to submit ZK proofs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please connect your wallet first</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mock Proof Generator for Demo */}
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Generate ZK Proof (Demo)
          </CardTitle>
          <CardDescription>
            Enter your qualifications to generate a privacy-preserving proof
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification Score (%)</Label>
            <Input
              id="qualification"
              type="number"
              value={mockProof.qualification}
              onChange={(e) => setMockProof({
                ...mockProof,
                qualification: parseInt(e.target.value)
              })}
              min="0"
              max="100"
            />
            <p className="text-xs text-muted-foreground">
              Minimum required: 70%
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              value={mockProof.experience}
              onChange={(e) => setMockProof({
                ...mockProof,
                experience: parseInt(e.target.value)
              })}
              min="0"
            />
            <p className="text-xs text-muted-foreground">
              Minimum required: 2 years
            </p>
          </div>

          <Button
            onClick={generateMockProof}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate ZK Proof
          </Button>

          {mockProof.qualification >= 70 && mockProof.experience >= 2 ? (
            <Badge variant="default" className="w-full justify-center">
              <CheckCircle className="mr-1 h-3 w-3" />
              Qualified for Grants
            </Badge>
          ) : (
            <Badge variant="destructive" className="w-full justify-center">
              <AlertCircle className="mr-1 h-3 w-3" />
              Not Qualified
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Proof Display and Upload */}
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Submit ZK Proof
          </CardTitle>
          <CardDescription>
            Upload or use generated proof to verify your qualifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proof-file">Upload Proof File (Optional)</Label>
            <Input
              id="proof-file"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proof-data">ZK Proof Data</Label>
            <Textarea
              id="proof-data"
              value={proofData}
              onChange={(e) => setProofData(e.target.value)}
              placeholder="Paste your ZK proof JSON here or generate one above"
              rows={8}
              className="font-mono text-xs"
            />
          </div>

          <Button
            onClick={submitProof}
            disabled={!proofData || isPending || isConfirming || !CONTRACT_ADDRESSES.GRANT_PROGRAM}
            className="w-full"
          >
            {(isPending || isConfirming) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isConfirming ? 'Confirming...' : 'Submit ZK Proof'}
          </Button>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700">{error.message}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Your actual scores remain private</p>
            <p>• Only qualification status is revealed</p>
            <p>• Cryptographically verifiable proof</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}