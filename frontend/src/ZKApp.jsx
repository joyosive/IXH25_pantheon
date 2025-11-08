import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { wagmiConfig } from '@/lib/web3'
import ZKProofDemo from '@/pages/ZKProofDemo'

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function ZKApp() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<ZKProofDemo />} />
              <Route path="/demo" element={<ZKProofDemo />} />
            </Routes>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ZKApp