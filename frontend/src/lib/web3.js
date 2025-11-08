import { createConfig, http } from 'wagmi'
import { metaMask, injected } from 'wagmi/connectors'

// XRPL EVM Testnet Configuration
const xrplTestnet = {
  id: 1449000,
  name: 'XRPL EVM Testnet',
  network: 'xrpl-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'XRP',
    symbol: 'XRP',
  },
  rpcUrls: {
    public: { http: ['https://rpc-evm-sidechain.xrpl.org'] },
    default: { http: ['https://rpc-evm-sidechain.xrpl.org'] },
  },
  blockExplorers: {
    default: { name: 'XRPL Explorer', url: 'https://evm-sidechain.xrpl.org' },
  },
  testnet: true,
}

// Configure wagmi v2 style
export const wagmiConfig = createConfig({
  chains: [xrplTestnet],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'ZKProofPay',
        url: window.location.hostname,
      }
    }),
    injected(),
  ],
  transports: {
    [xrplTestnet.id]: http('https://rpc-evm-sidechain.xrpl.org'),
  },
})

export { xrplTestnet }

// Contract addresses (placeholder)
export const CONTRACT_ADDRESSES = {
  VERIFIER: '0x728c845b1ba5212e3298757ff6100ab16229d351',
  GRANT_PROGRAM: null, // Will be set after deployment
}