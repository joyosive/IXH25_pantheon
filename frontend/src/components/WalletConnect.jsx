import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export function WalletConnect() {
  const { address, isConnecting, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            Connected to XRPL EVM Testnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Address:</p>
            <Badge variant="outline" className="font-mono text-xs">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Badge>
          </div>

          <Button
            onClick={() => disconnect()}
            variant="outline"
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to interact with ZK Proof Grant system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => connect({ connector })}
            disabled={!connector.ready || isLoading}
            className="w-full justify-start"
            variant={connector.id === 'metaMask' ? 'default' : 'outline'}
          >
            {isLoading && connector.id === pendingConnector?.id && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Wallet className="mr-2 h-4 w-4" />
            {connector.name}
            {!connector.ready && ' (Unavailable)'}
          </Button>
        ))}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Make sure you're on XRPL EVM Testnet</p>
          <p>• Get testnet XRP from the faucet</p>
          <p>• Chain ID: 1449000</p>
        </div>
      </CardContent>
    </Card>
  )
}