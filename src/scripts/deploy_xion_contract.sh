#!/bin/bash

# Deploy Xion Agent Action Contract
# This script deploys the smart contract to Xion testnet

echo "🚀 Deploying Agent Action Contract to Xion Testnet..."

# Check if wasmd is installed
if ! command -v wasmd &> /dev/null; then
    echo "❌ wasmd not found. Please install Cosmos SDK first."
    exit 1
fi

# Set Xion testnet configuration
export CHAIN_ID="xion-testnet-1"
export RPC_URL="https://xion-testnet-rpc.burnt.com"
export GAS_PRICE="0.025ustars"

# Build the contract
echo "📦 Building contract..."
cargo build --target wasm32-unknown-unknown --release

# Optimize the wasm
echo "🔧 Optimizing wasm..."
wasm-opt -Os target/wasm32-unknown-unknown/release/xion_agent_contract.wasm -o target/wasm32-unknown-unknown/release/xion_agent_contract_optimized.wasm

# Deploy to Xion testnet
echo "🌐 Deploying to Xion testnet..."
wasmd tx wasm store target/wasm32-unknown-unknown/release/xion_agent_contract_optimized.wasm \
    --from your-wallet \
    --chain-id $CHAIN_ID \
    --gas auto \
    --gas-adjustment 1.3 \
    --gas-prices $GAS_PRICE \
    --node $RPC_URL \
    --yes

echo "✅ Contract deployed successfully!"
echo "📋 Next steps:"
echo "1. Get the contract address from the transaction"
echo "2. Update your .env.local file with the contract address"
echo "3. Initialize the contract with your admin address"
