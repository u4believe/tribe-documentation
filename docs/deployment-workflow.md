---
sidebar_position: 8
---

# Deployment & Migration Workflow

This section details the full lifecycle of a Tribe meme token: creation → locked phase → unlocking → bonding‑curve trading → completion → DEX migration → open trading. It explains how each phase is automated, how creator actions affect progression, and how the workflow ensures fairness, transparency, and predictable outcomes for every Tribe.

## Complete Token Lifecycle

The Tribe workflow is designed to be fully automated, ensuring that every token follows a predictable path from creation to DEX trading. Each phase has specific requirements and outcomes that maintain fairness and transparency.

## Deployment Steps

### 1. Deploy Launchpad Contract

Deploy the main MemeLaunchpad contract to your target network:

```solidity
// Using Hardhat
npx hardhat run scripts/deploy.js --network mainnet

// Using Foundry
forge script scripts/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

**Deployment Checklist:**
- [ ] Contract compiled successfully
- [ ] Network selected (mainnet/testnet)
- [ ] Sufficient gas for deployment
- [ ] Contract address saved
- [ ] Deployment transaction verified

### 2. Set Treasury Address

Configure the treasury address for fee collection:

```typescript
await contract.setTreasury(TREASURY_ADDRESS);
```

**Important:**
- Treasury address should be a multisig or secure wallet
- Verify address before setting
- Test with small amounts first

### 3. Set DEX Router

Configure the DEX router for liquidity migration:

```typescript
await contract.setRouter(DEX_ROUTER_ADDRESS);
```

**Router Requirements:**
- Must implement Uniswap V2 router interface
- Must support `addLiquidityETH()` function
- Should be verified and trusted

### 4. Approve Router

Approve the router to spend tokens (if needed):

```typescript
await contract.approveRouter(TOKEN_ADDRESS);
```

### 5. Frontend Integration

Integrate the deployed contract into your frontend:

```typescript
const LAUNCHPAD_ADDRESS = '0x...'; // Your deployed address
const contract = new ethers.Contract(
  LAUNCHPAD_ADDRESS,
  ABI,
  signer
);
```

## Token Creation Workflow

### Phase 1: Token Creation

**User Action:** Creator calls `createToken()`

```typescript
const tx = await contract.createToken(
  'My Token', 
  'MTK',
  'https://image.url',
  'https://intuition.claim.link' // Optional
);
const receipt = await tx.wait();
const tokenAddress = extractTokenAddress(receipt);
```

**What Happens:**
- New ERC-20 token deployed
- 300M tokens (30%) minted to launchpad
- 700M tokens (70%) available for curve
- Token registered in system
- Initial state: **Locked**

**Outcome:** Token exists but cannot be traded yet

### Phase 2: Locked State

**State:** Token is **Locked**

**Requirements:**
- Creator must buy 2% of total supply (20M tokens)
- No public trading allowed
- Only creator can purchase during this phase

**Creator Action:**
```typescript
// Creator buys to unlock
const unlockAmount = 20_000_000; // 2% of 1B
await contract.buyTokens(tokenAddress, minTokensOut, {
  value: trustAmount
});
```

**What Happens:**
- Creator purchases tokens
- System tracks creator purchases
- When 2% threshold reached → **Unlocked**

**Outcome:** Token becomes available for public trading

### Phase 3: Unlocked - Bonding Curve Trading

**State:** Token is **Unlocked**

**What Happens:**
- Public can now buy/sell tokens
- Bonding curve is active
- Price increases as supply decreases (buying)
- Price decreases as supply increases (selling)
- 2% fee on all transactions → treasury
- Points system tracks user participation

**User Actions:**
- Buy tokens with TRUST
- Sell tokens back to curve
- Add comments (0.025 TRUST fee)
- Track points earned

**Progression:**
- Curve supply decreases as tokens are bought
- When curve reaches 0 (700M tokens distributed) → **Completed**

### Phase 4: Curve Completion

**State:** Token is **Completed**

**Trigger:** All 700M curve tokens have been distributed

**What Happens:**
- No more curve trading
- Automatic liquidity migration triggers
- System prepares for DEX migration

**Outcome:** Ready for DEX migration

### Phase 5: Automatic DEX Migration

**State:** Migration in progress

**What Happens Automatically:**
1. System collects 300M held tokens
2. System collects all TRUST balance
3. Approves router to spend tokens
4. Calls `addLiquidityETH()` on router
5. Creates TRUST/token pair on DEX
6. LP tokens permanently locked in contract

**Key Points:**
- Fully automated - no manual intervention
- LP tokens cannot be withdrawn (permanently locked)
- Guarantees safe, trustless transition
- Token now trades on DEX

**Outcome:** Token is live on DEX

### Phase 6: Live on DEX

**State:** Token trades on DEX

**What Happens:**
- Standard DEX AMM mechanics apply
- No more bonding curve
- No slippage fees (standard DEX fees)
- Independent trading

**User Actions:**
- Trade on DEX using standard AMM
- No interaction with launchpad needed
- Token fully independent

## Workflow Diagram

```
┌──────────────────────┐
│  Deploy Launchpad    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Set Treasury + Router│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Frontend Integrated  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Users Create Tokens  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Token Created (Locked)│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Creator Buys 2%      │
│    → Unlocked        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Public Trading       │
│ (Curve Active)       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Users Buy/Sell     │
└──────┬───────────┬───┘
       │           │
       ▼           ▼
┌──────────┐ ┌──────────┐
│ Points   │ │ Volume   │
│ Earned   │ │ Tracked  │
└──────────┘ └────┬─────┘
                  │
                  ▼
┌──────────────────────┐
│ Curve Completes      │
│ (700M distributed)   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Auto-Migration       │
│    to DEX             │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 300M tokens + TRUST  │
│  → Liquidity         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  LP tokens locked    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Token Trades on DEX  │
└──────────────────────┘
```

## Automation Features

### Fully Automated Phases

1. **Token Creation** - One function call
2. **Unlock Detection** - Automatic when 2% reached
3. **Curve Completion** - Automatic detection
4. **Liquidity Migration** - Automatic when curve completes
5. **Fee Routing** - Automatic to treasury

### Creator Actions Required

1. **Initial Creation** - Call `createToken()`
2. **Unlock Token** - Buy 2% of supply

### No Manual Intervention Needed

- Curve trading runs automatically
- Migration happens automatically
- Fees route automatically
- Points update automatically

## Fairness Guarantees

The workflow ensures:

- **Transparency** - All actions on-chain
- **Fairness** - Same rules for everyone
- **Predictability** - Known outcomes at each phase
- **Security** - LP tokens permanently locked
- **Trustless** - No intermediaries required

## Monitoring Lifecycle

Frontend applications should monitor:

- Token state (locked/unlocked/completed)
- Creator purchase amount
- Curve progress (current supply vs 700M max)
- Migration status
- Points earned by users

## Network-Specific Considerations

### Mainnet Deployment

- Use verified contracts
- Set up monitoring
- Configure multisig for admin functions
- Test thoroughly on testnet first

### Testnet Deployment

- Use testnet TRUST for testing
- Verify all functions work
- Test edge cases
- Simulate full lifecycle

### Custom Networks

- Ensure DEX router exists
- Verify network compatibility
- Test contract interactions
- Configure RPC endpoints

## Troubleshooting

### Token Stuck in Locked State

**Issue:** Token remains locked

**Solutions:**
- Verify creator bought 2% (20M tokens)
- Check unlock logic
- Review transaction history

### Migration Fails

**Issue:** Liquidity migration fails

**Solutions:**
- Check router is set correctly
- Verify sufficient tokens (300M) and TRUST
- Check router approval
- Review gas limits

### High Gas Costs

**Issue:** Transactions expensive

**Solutions:**
- Optimize contract calls
- Batch operations
- Use gas-efficient patterns

## Best Practices

1. **Test Thoroughly** - Test all phases on testnet
2. **Monitor Events** - Set up event listeners
3. **Secure Admin** - Use multisig for admin functions
4. **Document Changes** - Keep deployment logs
5. **Backup Data** - Store contract addresses and ABIs
6. **Version Control** - Tag contract versions

## Next Steps

- Review [Security](./security) considerations
- Check [API Integration](./api-integration) for frontend setup
- See [FAQ](./faq) for common questions
