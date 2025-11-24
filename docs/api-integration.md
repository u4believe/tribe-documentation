---
sidebar_position: 7
---

# API / Frontend Integration

This guide covers how to integrate the TRIBE MemeLaunchpad smart contracts into your frontend application.

## Recommended Approach

**ABI-based contract calls** are recommended for integration. This provides:

- Type safety with TypeScript
- Better error handling
- IDE autocomplete
- Compile-time validation

## Setup

### 1. Install Dependencies

```bash
npm install ethers
# or
npm install viem
```

### 2. Contract ABI

Import or define the contract ABI:

```typescript
import MemeLaunchpadABI from './abis/MemeLaunchpad.json';
```

### 3. Provider Setup

```typescript
import { ethers } from 'ethers';

// Using MetaMask or other Web3 provider
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(
  LAUNCHPAD_ADDRESS,
  MemeLaunchpadABI,
  signer
);
```

## Core Functions

### Create Token

```typescript
async function createToken(
  name: string, 
  symbol: string, 
  image: string, 
  claimLink?: string
) {
  try {
    const tx = await contract.createToken(name, symbol);
    const receipt = await tx.wait();
    
    // Extract token address from event
    const event = receipt.logs.find(
      log => log.topics[0] === 'TokenCreated'
    );
    const tokenAddress = event.args.token;
    
    return tokenAddress;
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
}
```

### Buy Tokens

```typescript
async function buyTokens(
  tokenAddress: string,
  minTokensOut: bigint,
  trustAmount: bigint
) {
  try {
    const tx = await contract.buyTokens(tokenAddress, minTokensOut, {
      value: ethAmount
    });
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error buying tokens:', error);
    throw error;
  }
}

// Calculate minTokensOut with slippage
function calculateMinTokensOut(
  expectedTokens: bigint,
  slippageBps: number = 500 // 5% slippage
): bigint {
  return expectedTokens * BigInt(10000 - slippageBps) / BigInt(10000);
}
```

### Sell Tokens

```typescript
async function sellTokens(
  tokenAddress: string,
  amount: bigint,
  minTrustOut: bigint
) {
  try {
    // First, approve tokens
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      signer
    );
    await tokenContract.approve(LAUNCHPAD_ADDRESS, amount);
    
    // Then sell
    const tx = await contract.sellTokens(
      tokenAddress,
      amount,
      minEthOut
    );
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error selling tokens:', error);
    throw error;
  }
}
```

### Add Comment

```typescript
async function addComment(tokenAddress: string, text: string) {
  try {
    const commentFee = ethers.parseEther('0.025'); // 0.025 TRUST
    const tx = await contract.addComment(tokenAddress, text, {
      value: commentFee
    });
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}
```

### Detect Completion and Use DEX Liquidity

```typescript
async function checkTokenCompletion(tokenAddress: string) {
  try {
    const tokenInfo = await contract.getTokenInfo(tokenAddress);
    if (tokenInfo.isCompleted) {
      // Token has migrated to DEX
      // Use DEX router to interact with liquidity
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking completion:', error);
    throw error;
  }
}
```

## Read Functions

### Get Token Info

```typescript
async function getTokenInfo(tokenAddress: string) {
  try {
    const info = await contract.getTokenInfo(tokenAddress);
    return {
      name: info.name,
      symbol: info.symbol,
      creator: info.creator,
      totalSupply: info.totalSupply.toString(),
      curveSupply: info.curveSupply.toString(),
      maxCurveSupply: info.maxCurveSupply.toString(),
      creatorBought: info.creatorBought.toString(),
      isUnlocked: info.isUnlocked,
      isCompleted: info.isCompleted,
      tradingVolume: info.tradingVolume.toString()
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    throw error;
  }
}
```

### Get Comments

```typescript
async function getComments(tokenAddress: string) {
  try {
    const comments = await contract.getComments(tokenAddress);
    return comments.map(comment => ({
      user: comment.user,
      text: comment.text,
      timestamp: Number(comment.timestamp)
    }));
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
}
```

### Get All Tokens

```typescript
async function getAllTokens(): Promise<string[]> {
  try {
    const tokens = await contract.getAllTokens();
    return tokens;
  } catch (error) {
    console.error('Error getting all tokens:', error);
    throw error;
  }
}
```

### Get Current Price

```typescript
async function getCurrentPrice(tokenAddress: string): Promise<bigint> {
  try {
    const price = await contract.getCurrentPrice(tokenAddress);
    return price;
  } catch (error) {
    console.error('Error getting price:', error);
    throw error;
  }
}
```

## Event Listening

### Listen for Token Created

```typescript
contract.on('TokenCreated', (token, creator, name, symbol, event) => {
  console.log('New token created:', {
    token,
    creator,
    name,
    symbol
  });
  // Update UI
});
```

### Listen for Token Bought

```typescript
contract.on('TokensBought', (token, buyer, ethAmount, tokensAmount, event) => {
  console.log('Tokens bought:', {
    token,
    buyer,
    ethAmount: ethAmount.toString(),
    tokensAmount: tokensAmount.toString()
  });
  // Update UI, refresh token info
});
```

### Listen for Token Sold

```typescript
contract.on('TokensSold', (token, seller, tokensAmount, ethAmount, event) => {
  console.log('Tokens sold:', {
    token,
    seller,
    tokensAmount: tokensAmount.toString(),
    ethAmount: ethAmount.toString()
  });
  // Update UI, refresh token info
});
```

### Listen for Liquidity Migrated

```typescript
contract.on('LiquidityMigrated', (token, tokenAmount, ethAmount, lpToken, event) => {
  console.log('Liquidity migrated:', {
    token,
    tokenAmount: tokenAmount.toString(),
    ethAmount: ethAmount.toString(),
    lpToken
  });
  // Update UI, show DEX link
});
```

## Price Calculation (Frontend)

Calculate expected tokens before transaction:

```typescript
function calculateTokensFromEth(
  ethAmount: bigint,
  currentSupply: bigint,
  stepSize: bigint,
  initialPrice: bigint
): bigint {
  // Simplified calculation - actual implementation may vary
  // This is a rough approximation
  const price = initialPrice * (1n + (currentSupply / stepSize) ** 2n);
  return ethAmount / price;
}
```

## Error Handling

```typescript
async function handleTransaction(txPromise: Promise<any>) {
  try {
    const tx = await txPromise;
    const receipt = await tx.wait();
    return { success: true, receipt };
  } catch (error: any) {
    if (error.code === 'ACTION_REJECTED') {
      return { success: false, error: 'User rejected transaction' };
    }
    if (error.reason) {
      return { success: false, error: error.reason };
    }
    return { success: false, error: error.message };
  }
}
```

## Integration with ThirdWeb

If using ThirdWeb React SDK:

```typescript
import { useContract, useContractWrite } from '@thirdweb-dev/react';

function CreateTokenButton() {
  const { contract } = useContract(LAUNCHPAD_ADDRESS);
  const { mutate: createToken, isLoading } = useContractWrite(
    contract,
    'createToken'
  );

  const handleCreate = () => {
    createToken({
      args: ['My Token', 'MTK']
    });
  };

  return (
    <button onClick={handleCreate} disabled={isLoading}>
      Create Token
    </button>
  );
}
```

## Best Practices

1. **Always check token state** before allowing transactions
2. **Calculate slippage** based on current curve state
3. **Show loading states** during transactions
4. **Handle errors gracefully** with user-friendly messages
5. **Listen to events** for real-time updates
6. **Cache token info** to reduce RPC calls
7. **Validate inputs** before sending transactions

## Example Integration

```typescript
// Complete example
class MemeLaunchpadClient {
  private contract: ethers.Contract;
  
  constructor(address: string, signer: ethers.Signer) {
    this.contract = new ethers.Contract(address, ABI, signer);
  }
  
  async createToken(name: string, symbol: string) {
    const tx = await this.contract.createToken(name, symbol);
    return await tx.wait();
  }
  
  async buyTokens(token: string, minOut: bigint, value: bigint) {
    const tx = await this.contract.buyTokens(token, minOut, { value });
    return await tx.wait();
  }
  
  // ... other methods
}
```

## Next Steps

- Review [Smart Contract Documentation](./smart-contracts) for function details
- Check [Deployment Workflow](./deployment-workflow) for setup
- See [Security](./security) for best practices

