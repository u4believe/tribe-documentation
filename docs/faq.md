---
sidebar_position: 10
---

# FAQ

Frequently asked questions about the TRIBE MemeLaunchpad.

## General Questions

### What is TRIBE MemeLaunchpad?

TRIBE MemeLaunchpad is a platform that enables instant deployment of meme tokens with bonding curve pricing, automated liquidity migration to DEX, and social features.

### How does the bonding curve work?

The bonding curve uses a quadratic formula where price increases as supply increases. 70% of tokens are available via the curve, and 30% are held for liquidity migration.

### What happens when the bonding curve completes?

When the curve reaches its maximum (70% tokens distributed), the token automatically migrates liquidity to a DEX. The 30% held tokens plus all collected ETH are used to create a DEX liquidity pair.

## Token Creation

### How do I create a token?

Call the `createToken(name, symbol)` function with your desired token name and symbol. The token will be deployed and registered with the launchpad.

### What are the requirements for creating a token?

- Provide a unique name and symbol
- Pay gas fees for deployment
- No upfront costs beyond gas

### Can I customize my token?

Token name and symbol are set at creation and cannot be changed. The token follows standard ERC-20 functionality.

## Trading

### How do I buy tokens?

Call `buyTokens(token, minTokensOut)` with TRUST. The function calculates tokens based on the current bonding curve price.

### How do I sell tokens?

First approve the launchpad to spend your tokens, then call `sellTokens(token, amount, minEthOut)`. Tokens are burned and TRUST is returned.

### What are the fees?

- **2% fee** on all buy/sell transactions
- Fees are automatically sent to the treasury
- **0.025 TRUST** fee for posting comments

### Can I set custom slippage?

Yes, you specify `minTokensOut` when buying and `minEthOut` when selling. The transaction will revert if slippage exceeds your tolerance.

## Creator Rules

### Why are tokens locked initially?

Tokens start locked to ensure creator commitment. The creator must buy 2% of the total supply to unlock public trading.

### What is the creator purchase limit?

Creators can purchase a maximum of 20% of the curve supply to ensure fair distribution.

### Can the creator unlock the token without buying?

No, the creator must purchase 2% of the total supply to unlock the token. This ensures creator has skin in the game.

## Liquidity Migration

### When does liquidity migration happen?

Migration occurs automatically when the bonding curve completes (all 70% curve tokens distributed).

### What happens to my tokens after migration?

After migration, tokens trade on the DEX using standard AMM mechanics. The bonding curve is no longer active.

### Can slippage fees be applied after token migrates to DEX?

**No.** After migration, trading follows standard DEX rules and fees. The launchpad's 2% slippage fee no longer applies.

### Who controls the LP tokens?

LP tokens remain in the launchpad contract after migration. They can be managed by the contract admin if needed.

## Integration

### Can I integrate the DEX using ABI only?

**Yes.** ABI integration is recommended for frontend applications. You can use ethers.js, viem, or Web3.js with the contract ABI.

### Should router be deployed separately?

**Yes.** Keep DEX integration separate from the launchpad. The launchpad interacts with an existing DEX router contract.

### What DEX routers are supported?

Any router that implements the Uniswap V2 router interface with `addLiquidityETH()` function is supported.

## Technical

### What blockchain networks are supported?

The launchpad can be deployed on any EVM-compatible network. The current configuration uses chain ID 1155, but this can be customized.

### How are prices calculated?

Prices use a quadratic formula: `price = INITIAL_PRICE * (1 + (supply/stepSize)^2)`

### Are there gas optimizations?

The contract uses standard gas optimization techniques including:
- Efficient storage patterns
- Minimal external calls
- Batch operations where possible

### How do I monitor token events?

Listen to contract events:
- `TokenCreated` - New token deployed
- `TokensBought` - Purchase transaction
- `TokensSold` - Sale transaction
- `TokenUnlocked` - Creator unlocked token
- `LiquidityMigrated` - Migration to DEX
- `CommentAdded` - New comment posted

## Security

### Is the contract audited?

Check the latest audit reports in the project repository. Always verify contract addresses before interacting.

### What security features are in place?

- Reentrancy guards
- Creator buy limits
- Unlock enforcement
- Valid token checks
- Exact fee checks
- Router validation
- Slippage protection

### Can tokens be rug pulled?

The unlock requirement (creator must buy 2%) and purchase limits help prevent rug pulls. However, always DYOR (Do Your Own Research) before investing.

## Comments

### How do I add a comment?

Call `addComment(token, text)` with 0.025 ETH. The comment is stored on-chain permanently.

### Can I edit or delete comments?

No, comments are immutable once posted. They are permanently stored on-chain.

### Are comments moderated?

Comments are not moderated by the contract. They are stored as-is on-chain.

## Troubleshooting

### Transaction fails with "Token is locked"

The token creator hasn't purchased 2% yet. Only the creator can buy during the locked phase.

### Transaction fails with "Slippage too high"

The price moved more than your slippage tolerance. Increase your `minTokensOut` or `minEthOut` value.

### Migration fails

Check:
- Router is set correctly
- Sufficient tokens and ETH available
- Router approval is in place
- Gas limits are sufficient

### Can't find my token

Use `getAllTokens()` to get a list of all tokens, or search by creator address using events.

## Still Have Questions?

- Review the [Smart Contract Documentation](./smart-contracts)
- Check [API Integration](./api-integration) for technical details
- See [Deployment Workflow](./deployment-workflow) for setup questions

