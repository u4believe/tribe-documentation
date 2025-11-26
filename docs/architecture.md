---
sidebar_position: 5
---

# System Architecture

This section provides a comprehensive overview of the TRIBE MemeLaunchpad system architecture, including technical diagrams and component interactions.

## Architecture Overview

```
┌─────────────────┐
│  Frontend UI    │
└────────┬────────┘
         │ Web3 calls
         ▼
┌─────────────────────────┐
│ MemeLaunchpad Contract  │
│  ├─ Deploys MemeTokens   │
│  ├─ Manages bonding curve│
│  ├─ Buy/sell logic       │
│  └─ Unlock rules         │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────┐
│ MemeToken       │
│ Contracts       │
│ Mint/Burn       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  DEX Router     │
│  → LP Pool      │
└─────────────────┘
```

## Component Breakdown

### 1. Frontend UI

The user interface layer that interacts with the smart contracts:

- **Wallet Connection** - ThirdWeb integration for wallet management
- **Token Creation** - Interface for creating new tokens
- **Trading Interface** - Buy/sell functionality with TRUST
- **Token Discovery** - Browse and search tokens
- **Comment System** - Social features UI
- **Points Display** - Show user points from trading

### 2. MemeLaunchpad Contract

The main smart contract that orchestrates the entire system:

**Key Responsibilities:**
- Token deployment and registration
- Bonding curve management
- Buy/sell transaction processing with TRUST
- Creator unlock rules enforcement
- Comment system management
- Liquidity migration coordination
- Treasury fee routing
- Points system management

**Core Functions:**
- `createToken()` - Deploy new meme token
- `buyTokens()` - Purchase tokens via curve with TRUST
- `sellTokens()` - Sell tokens back to curve
- `addComment()` - Post on-chain comment
- `migrateLiquidity()` - Auto-migrate to DEX

### 3. MemeToken Contracts

Individual ERC-20 token contracts for each meme token:

- Standard ERC-20 implementation
- Launchpad contract set as minter
- Mint/burn functionality
- Transfer restrictions during locked state

### 4. DEX Router

External DEX router integration:

- Standard DEX router interface (Uniswap V2 compatible)
- `addLiquidityETH()` function
- LP token creation
- Price oracle integration

### 5. LP Pool

Liquidity pool created on DEX:

- TRUST/token pair
- Standard AMM mechanics
- LP tokens held permanently in launchpad contract

## Bonding Curve Flow

```
┌──────────────────────┐
│ User → Sends TRUST   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Calculate current    │
│       price          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Check limits &       │
│     slippage         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Mint tokens       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Update supply,       │
│ volumes, fees         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Update points system │
└──────────────────────┘
```

### Detailed Flow

1. **User Initiates Buy**
   - Frontend calls `buyTokens(token, minTokensOut)`
   - TRUST sent with transaction

2. **Price Calculation**
   - Contract calculates current price using quadratic formula
   - Determines tokens to mint based on TRUST received

3. **Validation Checks**
   - Verify token exists and is unlocked
   - Check slippage protection (`minTokensOut`)
   - Validate creator limits (if applicable)
   - Ensure curve not completed

4. **Fee Processing**
   - Calculate 2% fee
   - Send fee to treasury
   - Remaining TRUST used for token purchase

5. **Token Minting**
   - Mint tokens to buyer
   - Update token supply
   - Update trading volumes

6. **Points System Update**
   - Update user points based on purchase
   - Reward early supporters
   - Track participation

7. **State Updates**
   - Update bonding curve state
   - Emit events for frontend
   - Check if curve completion reached

## Liquidity Migration

This section provides deeper insight into how tokens graduate from the bonding curve to a decentralized exchange. It describes the automatic migration process triggered when curve supply reaches 700M tokens, the addition of the remaining 300M tokens plus accumulated TRUST as liquidity, why LP tokens remain permanently locked, and how Tribe guarantees a safe, trustless transition to open‑market trading.

### Migration Flow

```
┌─────────────────────────────────────┐
│ Bonding curve filled (700M tokens)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Collect held tokens (300M) + TRUST  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Approve router              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│        addLiquidityETH()            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ LP stays permanently locked in      │
│            contract                 │
└─────────────────────────────────────┘
```

### Detailed Migration Process

1. **Trigger Condition**
   - Bonding curve reaches maximum (700M tokens distributed)
   - Token state changes to "Completed"

2. **Resource Collection**
   - Collect 300M held tokens (30% of supply)
   - Gather all TRUST balance from curve

3. **Router Approval**
   - Approve router to spend tokens
   - Verify router address is valid

4. **Liquidity Addition**
   - Call `addLiquidityETH()` on router
   - Create TRUST/token pair
   - Receive LP tokens

5. **LP Token Management**
   - LP tokens stored permanently in contract
   - Cannot be withdrawn (permanently locked)
   - Token now trades on DEX
   - Guarantees safe, trustless transition

## Data Flow

### Token Creation Flow

```
┌─────────────────────────────────────┐
│ User Input (name, symbol, image,   │
│           claimLink)               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      createToken() called           │
└──────────────┬──────────────────────┘
               │
               ├─ Deploy ERC-20 contract
               ├─ Set launchpad as minter
               ├─ Mint 300M to launchpad (30%)
               ├─ Register in mappings
               └─ Emit TokenCreated event
```

### Buy Flow

```
┌──────────────────────┐
│ User TRUST +          │
│   minTokensOut        │
└──────────┬────────────┘
           │
           ▼
┌──────────────────────┐
│  buyTokens() called  │
└──────────┬────────────┘
           │
           ├─ Calculate price
           ├─ Validate conditions
           ├─ Process fees
           ├─ Mint tokens
           ├─ Update points
           └─ Update state
```

### Sell Flow

```
┌──────────────────────┐
│ User tokens + approval│
└──────────┬────────────┘
           │
           ▼
┌──────────────────────┐
│ sellTokens() called  │
└──────────┬────────────┘
           │
           ├─ Calculate price
           ├─ Validate conditions
           ├─ Process fees
           ├─ Burn tokens
           └─ Send TRUST
```

## Storage Architecture

### Mappings

- `tokens` - Token address → TokenInfo
- `tokenCreators` - Token address → Creator address
- `comments` - Token address → Comment array
- `allTokens` - Array of all token addresses
- `userPoints` - User address → Points balance

### Structs

- `TokenInfo` - Metadata, supply, curve state
- `Comment` - User, text, timestamp

## Event System

Events emitted for frontend integration:

- `TokenCreated` - New token deployed
- `TokensBought` - Purchase transaction
- `TokensSold` - Sale transaction
- `TokenUnlocked` - Creator unlocked token
- `LiquidityMigrated` - Migration to DEX
- `CommentAdded` - New comment posted
- `PointsUpdated` - User points changed

## Security Architecture

### Access Control

- **Public Functions**: Buy, sell, create token, comment
- **Admin Functions**: Set treasury, update router, transfer ownership
- **Creator Functions**: Unlock token (via purchase)

### Reentrancy Protection

- Reentrancy guards on all state-changing functions
- Checks-Effects-Interactions pattern

### Validation Layers

- Token existence checks
- State validation (locked/unlocked/completed)
- Slippage protection
- Creator limit enforcement
- Fee calculation verification
- LP lock enforcement

## Governance & Voting Framework

Tribe introduces a transparent, decentralized, and community-controlled governance system that empowers holders to determine the timing of DEX migration for their meme coin. Each token launched on Tribe can undergo up to three voting phases, corresponding to each eligible migration trigger.

In every phase, each eligible community member can cast exactly one vote.

## Voting Proposal Creation

A migration proposal is automatically created by the Launchpad when one of the following conditions is met:

20% of bonding-curve tokens sold

40% of bonding-curve tokens sold

60% of bonding-curve tokens sold

Only after these thresholds are reached does the Launchpad initiate a migration vote.

## Voter Eligibility

Only holders who meet the following requirement may participate:

Must hold at least 100,000 units of the meme token under vote

Eligibility applies to all users, including the creator

This ensures all voters have a meaningful stake in the token’s future.

## Voting Power

Voting power is intentionally equalized to prevent whale dominance:

Every eligible holder receives 1 vote, regardless of their balance

The creator receives a fixed 20 votes, representing a 20% voting weight

This structure balances community influence while ensuring creator participation is meaningful but not overpowering.

## Voting Duration

Each voting phase lasts 72 hours from the moment the proposal is published.
This time window ensures global participation without delaying token progress.

## Voting Rules

Each participant may vote only once per phase

A minimum of 100 unique voters is required for a proposal to be valid

No ties — if the vote ends in a draw, the proposal is invalid

A proposal passes only if the winning option receives at least 59% of all votes

Percentages are not rounded upward

Example: 54.4% counts as 54%, not 55%

If a proposal is invalid, bonding-curve trading continues, and the token progresses to the next eligible voting phase.

## Voting Fee

A flat fee of 0.025 TRUST is charged when a voting transaction is approved.
This is the only cost associated with voting.

## Optionality of Voting

Voting participation is entirely optional.
However, community involvement directly shapes the token’s lifecycle and determines when it transitions from bonding-curve trading to DEX trading.

## Integration Points

### Frontend → Contract

- Web3 provider connection
- Contract ABI usage
- Event listening
- Transaction signing with TRUST

### Contract → DEX

- Router interface
- Liquidity addition
- Token approval

### Contract → Treasury

- Fee routing
- TRUST transfers

## Next Steps

- Review [Smart Contract Documentation](./smart-contracts)
- Learn about [API Integration](./api-integration)
- Check [Security Considerations](./security)
