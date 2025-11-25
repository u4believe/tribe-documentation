---
sidebar_position: 4
---

# Bonding Curve Mechanics

This section elaborates on Tribe's quadratic bonding curve system, which determines token price based on supply. It explains how the bonding curve sets initial pricing, how price rises as more tokens are purchased, the 70/30 supply distribution, and why this model ensures fairness, transparency, and early‑supporter incentives within the Tribe ecosystem.

## Curve Type

**Quadratic (Increasing price as supply increases)**

The price increases quadratically with supply, ensuring fair distribution and preventing manipulation. This model creates a transparent pricing mechanism where all participants interact with the same curve under clear, predictable rules.

## Token Distribution

- **70%** of tokens (700M tokens) available via bonding curve
- **30%** of tokens (300M tokens) held for liquidity migration to DEX

This distribution ensures:
- Sufficient tokens for bonding curve trading
- Adequate liquidity for DEX migration
- Fair price discovery mechanism

## Price Formula

The bonding curve uses the following formula:

```
price = INITIAL_PRICE * (1 + (supply/stepSize)^2)
```

Where:
- `INITIAL_PRICE` - Starting price per token
- `supply` - Current token supply in the curve
- `stepSize` - Step size parameter for curve calculation

### Price Behavior

- **Low Supply**: Lower prices, easier entry for early supporters
- **High Supply**: Higher prices, reflects growing demand
- **Quadratic Growth**: Price increases faster as supply increases
- **Transparency**: All pricing is on-chain and verifiable

## Buying Tokens

When a user buys tokens with TRUST:

1. **Calculate Current Price**
   ```
   currentPrice = INITIAL_PRICE * (1 + (currentSupply/stepSize)^2)
   ```

2. **Calculate Tokens Received**
   - Based on TRUST sent and current price
   - Accounts for curve mechanics
   - Includes slippage protection

3. **Slippage Protection**
   - User specifies `minTokensOut`
   - Transaction reverts if tokens received < `minTokensOut`
   - Protects users from unexpected price movements

4. **Fee Deduction**
   - 2% fee deducted from TRUST
   - Fee sent to treasury
   - Remaining TRUST used for token purchase

5. **Token Minting**
   - Tokens minted to buyer
   - Supply updated
   - Price increases for next purchase
   - Contributes to points system

6. **Points System**
   - Buying contributes to the points system
   - Rewards early supporters and active participants
   - Transparent and on-chain

## Selling Tokens

When a user sells tokens:

1. **Calculate Current Price**
   - Uses same formula as buying
   - Price decreases as supply decreases
   - Reflects current market state

2. **Calculate TRUST Returned**
   - Based on tokens being sold
   - Accounts for curve mechanics
   - Includes slippage protection

3. **Slippage Protection**
   - User can specify minimum TRUST out
   - Transaction reverts if TRUST < minimum
   - Protects users from unfavorable prices

4. **Fee Deduction**
   - 2% fee deducted from TRUST returned
   - Fee sent to treasury
   - Remaining TRUST sent to seller

5. **Token Burning**
   - Tokens burned from seller
   - Supply decreased
   - Price decreases for next sale
   - Maintains token economics balance

## Creator Limits

To prevent manipulation and ensure fair distribution:

### Unlock Requirement
- Creator must buy **2% of total supply** to unlock token
- Tokens remain locked until this threshold is met
- Ensures creator commitment and skin in the game

### Maximum Purchase Limit
- Creator limited to **maximum 20% of curve supply**
- Prevents creator from dominating the curve
- Ensures fair distribution to community
- Maintains transparency and fairness

## Slippage Protection

All transactions include slippage protection via `minTokensOut`:

### Buying
```solidity
require(tokensOut >= minTokensOut, "Slippage too high");
```

### Selling
```solidity
require(trustOut >= minTrustOut, "Slippage too high");
```

Users should set appropriate slippage tolerances based on:
- Current curve state
- Expected price movement
- Network congestion
- Market volatility

## Curve Completion

The bonding curve can complete in any of the four phases

## DEX Migration Phases

DEX migration on Tribe can occur during one of three community-initiated phases. Each phase corresponds to a specific percentage of bonding-curve token sales and is executed only when the community approves migration through the Tribe governance vote.
During any of these phases, once approved:

The completeTokenLaunch function is executed by the MemeLaunchpad

Liquidity migration to the DEX is performed automatically

All remaining bonding-curve tokens are burned (no further curve purchases allowed)

The token’s state is permanently updated to Completed

The phases are defined as follows:

**Phase 1 — Early Migration Trigger (20% Sold)**

Migration becomes eligible when 20% of bonding-curve tokens (140M) have been purchased.

If the community votes in favor:

completeTokenLaunch is executed

Liquidity is migrated automatically

Remaining curve tokens are burned

Token status updates to Completed


**Phase 2 — Mid-Curve Migration Trigger (40% Sold)**

Migration becomes eligible when 40% of bonding-curve tokens (280M) have been purchased.

If the community approves:

completeTokenLaunch is executed

Automatic liquidity migration occurs

Unsold curve tokens are burned

Token state becomes Completed


**Phase 3 — Late-Curve Migration Trigger (69% Sold)**

Migration becomes eligible when 69% of bonding-curve tokens (483M) have been purchased.

If approved by the community:

completeTokenLaunch is called

Liquidity migration is executed

All remaining curve tokens are burned

Token state transitions to Completed


**Final Automatic Migration (Mandatory)**

While the first three phases rely entirely on community voting, the final migration phase is automatic.

When 100% of bonding-curve supply (700M tokens) is sold:

The MemeLaunchpad automatically calls completeTokenLaunch

Migration is executed without requiring a vote

All reserved tokens + accumulated liquidity are moved to the DEX

This ensures that every meme token eventually graduates to open-market trading.

## Fair Launch Philosophy

Tribe's bonding curve reinforces a fair-launch philosophy where:

- All users interact with the same curve
- Transparent rules apply to everyone
- No special privileges or advantages
- Early supporters are rewarded
- Price discovery is organic and market-driven

## Example Calculation

Assume:
- `INITIAL_PRICE = 0.0001 TRUST`
- `stepSize = 1000`
- `currentSupply = 5000`

```
price = 0.0001 * (1 + (5000/1000)^2)
price = 0.0001 * (1 + 25)
price = 0.0001 * 26
price = 0.0026 TRUST per token
```

## Visual Representation

```
Price
  ↑
  |     ╱
  |    ╱
  |   ╱
  |  ╱
  | ╱
  |╱
  └─────────────────→ Supply
```

The curve shows exponential price growth as supply increases, rewarding early participants while maintaining fairness.

## Implementation Considerations

### Gas Optimization
- Price calculations should be gas-efficient
- Consider caching frequently accessed values
- Optimize for frequent trading operations

### Precision
- Use appropriate decimal precision
- Avoid rounding errors in calculations
- Ensure accurate price calculations

### Frontend Integration
- Calculate expected tokens before transaction
- Display current price to users
- Show slippage warnings
- Display points earned from purchases

## Next Steps

- Review [System Architecture](./architecture) for technical details
- Learn about [Smart Contract Functions](./smart-contracts)
- Check [API Integration](./api-integration) for frontend usage
