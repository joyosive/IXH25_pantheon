# ZKProofPay

Zero-Knowledge Proof powered scholarship applications on XRPL EVM using Circom & Solidity.

## Overview

ZKProofPay enables privacy-preserving conditional payments for scholarship applications. Students can prove their eligibility (GPA ≥ 3.4, education requirements, financial need) without revealing personal academic data using zero-knowledge proofs.

## Features

- **Privacy-First Applications**: Prove eligibility without exposing sensitive academic records
- **Zero-Knowledge Proofs**: Circom-based ZK circuits for academic verification
- **XRPL EVM Integration**: Smart contract verification on XRPL EVM Sidechain
- **MetaMask Integration**: Seamless wallet connection 
- **Academic Validation**: GPA, education years, and document verification

## Architecture

1. **Frontend**: React app with Wagmi for Web3 integration
2. **ZK Circuits**: Circom circuits for academic eligibility proofs
3. **Smart Contracts**: Solidity verifier contracts on XRPL EVM
4. **XRPL EVM Chain**: Decentralized verification and settlement

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Web3**: Wagmi, MetaMask integration
- **ZK Proofs**: Circom, snarkjs
- **Smart Contracts**: Solidity, Foundry
- **Blockchain**: XRPL EVM Sidechain (Testnet)

## Live Demo

- **Frontend**: Running on localhost with MetaMask integration
- **Verifier Contract**: [0x728c845b1ba5212e3298757ff6100ab16229d351](https://explorer.testnet.xrplevm.org/address/0x728c845b1ba5212e3298757ff6100ab16229d351?tab=token_transfers)
- **Test Account**: [0x7404aB7d6E2d38b27312d02470b8C5f2BdB29B4B](https://explorer.testnet.xrplevm.org/address/0x7404aB7d6E2d38b27312d02470b8C5f2BdB29B4B?tab=internal_txns)

## Quick Start

### Prerequisites

- Node.js 16+
- Foundry
- Circom 2.0+
- MetaMask wallet

### Installation

```bash
# Clone repository
git clone <repo-url>

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
forge install
```

## Usage

1. **Connect Wallet**: Connect MetaMask to XRPL EVM Testnet
2. **Fill Application**: Enter academic information (GPA ≥ 3.4 required)
3. **Generate ZK Proof**: Create privacy-preserving eligibility proof
4. **Submit to Blockchain**: Verify proof on XRPL EVM smart contract
5. **Await Results**: Scholarship decisions made without revealing personal data

## XRPL EVM Integration

- **Network**: XRPL EVM Sidechain Testnet
- **Chain ID**: 1449000
- **RPC URL**:  https://rpc.xrplevm.org/

