---
sidebar_position: 3
---

# Token Lifecycle

The TRIBE MemeLaunchpad manages tokens through a complete lifecycle from creation to DEX listing. Understanding this lifecycle is crucial for developers and users.

## Lifecycle Stages

```
[Created]
   │
   ▼
[Locked] — Creator must buy 2% to unlock
   │
   ▼
[Unlocked]
   │
   ├─ Users buy/sell via bonding curve
   │
   ▼
[Completed] — Bonding curve max reached
   │
   ▼
[Auto-Migrate Liquidity to DEX]
   │
   ▼
[Live on DEX]
```

## Stage 1: Created

When a token is first created:

1. **ERC-20 Token Deployment**
   - New token contract is deployed
   - Launchpad contract is set as minter
   - Token metadata (name, symbol) is registered

2. **Initial Supply Distribution**
   - **70%** of tokens available via bonding curve
   - **30%** held by launchpad for liquidity migration
   - Total supply is fixed at creation

3. **State Initialization**
   - Token state set to **Locked**
   - Bonding curve parameters initialized
   - Creator address registered

## Stage 2: Locked

Tokens remain locked until creator commitment:

- **Unlock Requirement**: Creator must buy **2% of total supply**
- **Purpose**: Ensures creator has skin in the game
- **Trading**: No public trading allowed during this stage
- **Creator Limit**: Creator can buy up to 20% of curve supply

### Unlock Process

```
Creator buys tokens → Check if 2% threshold reached → Unlock token
```

Once unlocked, the token moves to the next stage.

## Stage 3: Unlocked

Public trading begins:

- **Buying**: Users can purchase tokens via bonding curve
- **Selling**: Users can sell tokens back to the curve
- **Pricing**: Quadratic bonding curve determines prices
- **Fees**: 2% fee on all transactions → treasury
- **Volume Tracking**: All trades tracked on-chain

### Trading Mechanics

- Price increases as supply decreases (buying)
- Price decreases as supply increases (selling)
- Slippage protection via `minTokensOut` parameter
- Real-time price calculation

## Stage 4: Completed

Bonding curve reaches maximum:

- **Trigger**: All 70% curve tokens have been distributed
- **State**: Token marked as completed
- **Next Step**: Automatic liquidity migration begins

## Stage 5: Auto-Migrate Liquidity to DEX

Automated DEX listing process:

1. **Collect Resources**
   - 30% held tokens
   - All ETH balance from curve

2. **DEX Integration**
   - Approve router for token spending
   - Call `addLiquidityETH()` on DEX router
   - Create LP pair automatically

3. **LP Token Management**
   - LP tokens remain in launchpad contract
   - Can be managed by admin if needed

## Stage 6: Live on DEX

Token is now trading on DEX:

- **Trading**: Follows standard DEX AMM mechanics
- **Liquidity**: Provided from bonding curve completion
- **No Slippage Fees**: Standard DEX fees apply
- **Independent**: No longer managed by bonding curve

## State Transitions

| From State | To State | Trigger |
|------------|----------|---------|
| Created | Locked | Token creation |
| Locked | Unlocked | Creator buys 2% |
| Unlocked | Completed | Curve reaches max |
| Completed | Live on DEX | Liquidity migration |

## Monitoring Lifecycle

Frontend applications should monitor:

- Token state (locked/unlocked/completed)
- Creator purchase amount
- Curve progress (current supply vs max)
- Migration status

## Next Steps

- Learn about [Bonding Curve Mechanics](./bonding-curve)
- Understand [Smart Contract Functions](./smart-contracts)
- Review [Deployment Workflow](./deployment-workflow)

