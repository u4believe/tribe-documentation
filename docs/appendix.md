---
sidebar_position: 11
---

# Appendix

Technical reference for contract constants, storage mappings, events, and diagrams.

## Contract Constants

### Fee Constants

```solidity
uint256 public constant TREASURY_FEE_BPS = 200; // 2%
uint256 public constant COMMENT_FEE = 0.025 ether; // 0.025 TRUST
```

### Supply Constants

```solidity
uint256 public constant TOTAL_SUPPLY = 1_000_000_000; // 1B tokens
uint256 public constant CURVE_SUPPLY = 700_000_000; // 700M tokens (70%)
uint256 public constant LIQUIDITY_SUPPLY = 300_000_000; // 300M tokens (30%)
```

### Creator Constants

```solidity
uint256 public constant CREATOR_UNLOCK_PERCENT = 2; // 2% unlock requirement
uint256 public constant CREATOR_UNLOCK_AMOUNT = 20_000_000; // 20M tokens
uint256 public constant CREATOR_MAX_PERCENT = 20; // 20% max purchase
uint256 public constant CREATOR_MAX_AMOUNT = 140_000_000; // 140M tokens
```

### Curve Constants

```solidity
uint256 public constant INITIAL_PRICE = 0.0001 ether; // Initial price per token
uint256 public constant STEP_SIZE = 1000; // Step size for curve calculation
```

## Storage Mappings

### Primary Mappings

```solidity
// Token information mapping
mapping(address => TokenInfo) public tokens;

// Token creator mapping
mapping(address => address) public tokenCreators;

// Comments per token
mapping(address => Comment[]) public comments;

// User points tracking
mapping(address => uint256) public userPoints;

// All token addresses
address[] public allTokens;
```

### TokenInfo Struct

```solidity
struct TokenInfo {
    string name;              // Token name
    string symbol;            // Token symbol
    string image;             // Token image URL
    string claimLink;         // Optional Intuition claim link
    address creator;          // Creator address
    uint256 totalSupply;      // Total token supply (1B)
    uint256 curveSupply;      // Current curve supply
    uint256 maxCurveSupply;   // Maximum curve supply (700M)
    uint256 creatorBought;    // Amount creator has bought
    bool isUnlocked;          // Unlock status
    bool isCompleted;         // Curve completion status
    uint256 tradingVolume;    // Total trading volume
    uint256 createdAt;        // Creation timestamp
}
```

### Comment Struct

```solidity
struct Comment {
    address user;             // Comment author
    string text;              // Comment text
    uint256 timestamp;        // Comment timestamp
}
```

## Event List

### Token Events

```solidity
event TokenCreated(
    address indexed token,
    address indexed creator,
    string name,
    string symbol,
    string image,
    string claimLink
);
```

### Trading Events

```solidity
event TokensBought(
    address indexed token,
    address indexed buyer,
    uint256 trustAmount,
    uint256 tokensAmount,
    uint256 fee
);

event TokensSold(
    address indexed token,
    address indexed seller,
    uint256 tokensAmount,
    uint256 trustAmount,
    uint256 fee
);
```

### State Change Events

```solidity
event TokenUnlocked(
    address indexed token,
    address indexed creator,
    uint256 unlockAmount
);

event CurveCompleted(
    address indexed token,
    uint256 finalSupply
);
```

### Migration Events

```solidity
event LiquidityMigrated(
    address indexed token,
    uint256 tokenAmount,
    uint256 trustAmount,
    address lpToken,
    address pairAddress
);
```

### Social Events

```solidity
event CommentAdded(
    address indexed token,
    address indexed user,
    string text,
    uint256 timestamp
);
```

### Points Events

```solidity
event PointsUpdated(
    address indexed user,
    address indexed token,
    uint256 pointsEarned,
    uint256 totalPoints
);
```

### Admin Events

```solidity
event TreasuryUpdated(
    address indexed oldTreasury,
    address indexed newTreasury
);

event RouterUpdated(
    address indexed oldRouter,
    address indexed newRouter
);

event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
);
```

## Architecture Diagrams

### System Architecture

```
┌─────────────────┐
│  Frontend UI    │
│  (React/Next)   │
└────────┬────────┘
         │ Web3 Calls
         │ (TRUST transactions)
         ▼
┌─────────────────────────┐
│  MemeLaunchpad Contract │
│                         │
│  ├─ Deploys MemeTokens  │
│  ├─ Manages curve       │
│  ├─ Buy/sell logic      │
│  ├─ Unlock rules        │
│  ├─ Comment system      │
│  └─ Points tracking     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────┐
│ MemeToken       │
│ Contracts       │
│ (ERC-20)        │
│                 │
│ Mint/Burn       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  DEX Router     │
│  (Uniswap V2)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  LP Pool        │
│  (TRUST/Token)  │
└─────────────────┘
```

### Token Lifecycle Diagram

```
┌──────────┐
│ Created  │
│ (1B total)│
└────┬─────┘
     │
     ▼
┌──────────┐
│ Locked   │ ← Creator must buy 2% (20M)
│ (700M    │
│  curve)  │
└────┬─────┘
     │
     ▼
┌──────────┐
│Unlocked  │ ← Public trading active
│          │
│ Buy/Sell │
│ via curve│
└────┬─────┘
     │
     ▼
┌──────────┐
│Completed │ ← 700M distributed
│          │
└────┬─────┘
     │
     ▼
┌──────────┐
│Auto-     │ ← 300M + TRUST → DEX
│Migrate   │
│Liquidity │
└────┬─────┘
     │
     ▼
┌──────────┐
│Live on   │ ← Trading on DEX
│DEX       │
└──────────┘
```

### Bonding Curve Flow

```
User Action
    │
    ├─ Buy: Send TRUST
    │   │
    │   ├─ Calculate price
    │   ├─ Check slippage
    │   ├─ Mint tokens
    │   ├─ Update supply
    │   ├─ Update points
    │   └─ Emit event
    │
    └─ Sell: Approve tokens
        │
        ├─ Calculate price
        ├─ Check slippage
        ├─ Burn tokens
        ├─ Return TRUST
        └─ Emit event
```

### Liquidity Migration Flow

```
Curve Completes (700M)
    │
    ▼
Collect Resources
    ├─ 300M tokens
    └─ All TRUST balance
    │
    ▼
Approve Router
    │
    ▼
addLiquidityETH()
    │
    ▼
Create LP Pair
    │
    ▼
LP Tokens Locked
    │
    ▼
Token on DEX
```

## Function Signatures

### Public Functions

```solidity
function createToken(
    string memory name,
    string memory symbol,
    string memory image,
    string memory claimLink
) external returns (address);

function buyTokens(
    address token,
    uint256 minTokensOut
) external payable;

function sellTokens(
    address token,
    uint256 amount,
    uint256 minTrustOut
) external;

function addComment(
    address token,
    string memory text
) external payable;
```

### View Functions

```solidity
function getTokenInfo(address token) external view returns (TokenInfo memory);
function getComments(address token) external view returns (Comment[] memory);
function getAllTokens() external view returns (address[] memory);
function getCurrentPrice(address token) external view returns (uint256);
function getUserPoints(address user) external view returns (uint256);
```

### Admin Functions

```solidity
function setTreasury(address newTreasury) external onlyOwner;
function setRouter(address newRouter) external onlyOwner;
function approveRouter(address token) external onlyOwner;
function transferOwnership(address newOwner) external onlyOwner;
```

## Price Calculation Formula

### Quadratic Bonding Curve

```
price = INITIAL_PRICE * (1 + (supply / STEP_SIZE)^2)
```

Where:
- `INITIAL_PRICE = 0.0001 TRUST`
- `STEP_SIZE = 1000`
- `supply` = current curve supply

### Example Calculations

**At 0 supply:**
```
price = 0.0001 * (1 + (0/1000)^2)
price = 0.0001 * 1
price = 0.0001 TRUST
```

**At 1000 supply:**
```
price = 0.0001 * (1 + (1000/1000)^2)
price = 0.0001 * (1 + 1)
price = 0.0002 TRUST
```

**At 5000 supply:**
```
price = 0.0001 * (1 + (5000/1000)^2)
price = 0.0001 * (1 + 25)
price = 0.0026 TRUST
```

## Gas Estimates

Approximate gas costs (may vary):

- `createToken()`: ~500,000 gas
- `buyTokens()`: ~150,000 gas
- `sellTokens()`: ~120,000 gas
- `addComment()`: ~80,000 gas
- `migrateLiquidity()`: ~300,000 gas

## Network Compatibility

- Ethereum Mainnet
- Polygon
- Base
- Arbitrum
- Any EVM-compatible network

## Additional Resources

- [Smart Contract Documentation](./smart-contracts)
- [API Integration Guide](./api-integration)
- [Security Documentation](./security)
- [Deployment Workflow](./deployment-workflow)
