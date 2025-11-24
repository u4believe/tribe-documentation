---
sidebar_position: 6
---

# Smart Contract Documentation

Comprehensive documentation of the TRIBE MemeLaunchpad smart contract functions, data structures, and behavior.

## Key Components

### TokenInfo Struct

Stores token metadata and state:

```solidity
struct TokenInfo {
    string name;
    string symbol;
    address creator;
    uint256 totalSupply;
    uint256 curveSupply;
    uint256 maxCurveSupply;
    uint256 creatorBought;
    bool isUnlocked;
    bool isCompleted;
    uint256 tradingVolume;
}
```

### Comment Struct

On-chain comment data:

```solidity
struct Comment {
    address user;
    string text;
    uint256 timestamp;
}
```

## Core Functions

### Token Creation

This section expands on how creators launch new meme tokens on Tribe. It explains the minimal requirements (name, symbol, image, optional claim link), how the contract deploys a new ERC‑20 token, initializes supply distribution, applies creator buy‑limits, and registers the token as a new Tribe. The narrative emphasizes effortless, permissionless launch and the role of Intuition claim links for Tribe‑Oriented tokens.

#### `createToken(string memory name, string memory symbol, string memory image, string memory claimLink)`

Deploys a new meme token and registers it with the launchpad.

**Steps:**
1. User calls `createToken()`
2. New ERC-20 deployment
3. Launchpad set as minter
4. Mint 30% supply (300M tokens) to launchpad
5. Register token in mappings

**Parameters:**
- `name` - Token name
- `symbol` - Token symbol
- `image` - Token image URL
- `claimLink` - Optional Intuition claim link (for Tribe-Oriented tokens)

**Returns:**
- `address` - Address of deployed token

**State Changes:**
- New token contract deployed
- Token registered in `tokens` mapping
- Added to `allTokens` array
- Initial state: **Locked**

**Events:**
```solidity
event TokenCreated(address indexed token, address indexed creator, string name, string symbol);
```

### Buying Tokens

This section elaborates on the user buying experience during the bonding‑curve phase. It explains how users purchase tokens with TRUST, how the contract calculates price, how slippage protection works, how the 2% fee is handled, and how buying contributes to the points system. The explanation reinforces Tribe's fair‑launch philosophy where all users interact with the same curve under transparent rules.

#### `buyTokens(address token, uint256 minTokensOut)`

Purchase tokens via the bonding curve using TRUST.

**Steps:**
1. Payable function (receives TRUST)
2. Calculate tokens from TRUST
3. Quadratic pricing calculation
4. Slippage enforcement via `minTokensOut`
5. 2% fee → treasury
6. Check unlock status
7. Creator limit checks
8. Holder tracking
9. Points system update
10. Emit `TokensBought` event

**Parameters:**
- `token` - Token contract address
- `minTokensOut` - Minimum tokens expected (slippage protection)

**Requirements:**
- Token must exist
- Token must be unlocked (or creator buying to unlock)
- Sufficient ETH sent
- Slippage protection must pass
- Creator limit not exceeded (if creator)

**State Changes:**
- Token supply increased
- Trading volume updated
- Creator purchase tracked (if applicable)
- Unlock status checked

**Events:**
```solidity
event TokensBought(address indexed token, address indexed buyer, uint256 ethAmount, uint256 tokensAmount);
```

### Selling Tokens

This section expands on the selling process, detailing how users can exit positions by selling tokens back into the bonding curve. It describes how the curve determines TRUST return based on current supply, how tokens are burned after selling, how fees are routed to the treasury, and how this mechanism keeps token economics balanced before DEX migration.

#### `sellTokens(address token, uint256 amount, uint256 minTrustOut)`

Sell tokens back to the bonding curve.

**Steps:**
1. User approves tokens
2. ETH returned via curve price (calculated in TRUST)
3. 2% fee → treasury
4. Tokens burned

**Parameters:**
- `token` - Token contract address
- `amount` - Amount of tokens to sell
- `minEthOut` - Minimum ETH expected (slippage protection)

**Requirements:**
- Token must exist
- Token must be unlocked
- User must have approved tokens
- User must have sufficient balance
- Slippage protection must pass

**State Changes:**
- Token supply decreased
- Trading volume updated
- Tokens burned

**Events:**
```solidity
event TokensSold(address indexed token, address indexed seller, uint256 tokensAmount, uint256 ethAmount);
```

### Comment System

#### `addComment(address token, string memory text)`

Add an on-chain comment to a token.

**Steps:**
1. Validate token exists
2. Require 0.025 ETH payment
3. Create Comment struct
4. Add to token's comment array
5. Emit `CommentAdded` event

**Parameters:**
- `token` - Token contract address
- `text` - Comment text

**Requirements:**
- Token must exist
- Must send exactly 0.025 ETH
- Comment text not empty

**State Changes:**
- Comment added to `comments[token]` array

**Events:**
```solidity
event CommentAdded(address indexed token, address indexed user, string text, uint256 timestamp);
```

### Liquidity Migration

Triggered when bonding curve completes (700M tokens distributed):

**Steps:**
1. 30% held tokens (300M) added to DEX
2. All TRUST balance used
3. Uses router `addLiquidityETH()`
4. LP tokens permanently locked in contract

**Parameters:**
- `token` - Token contract address

**Requirements:**
- Token must exist
- Token must be in completed state
- Router must be set
- Sufficient tokens and ETH available

**State Changes:**
- Token liquidity added to DEX
- LP tokens stored in contract
- Token now trades on DEX

**Events:**
```solidity
event LiquidityMigrated(address indexed token, uint256 tokenAmount, uint256 ethAmount, address lpToken);
```

## View Functions

### `getTokenInfo(address token)`

Returns complete token information.

**Returns:** `TokenInfo` struct

### `getComments(address token)`

Returns all comments for a token.

**Returns:** `Comment[]` array

### `getAllTokens()`

Returns array of all token addresses.

**Returns:** `address[]` array

### `getCurrentPrice(address token)`

Calculates current token price from bonding curve.

**Returns:** `uint256` price in ETH

## Admin Functions

### `setTreasury(address newTreasury)`

Update treasury address for fee routing.

**Access:** Admin only

### `setRouter(address newRouter)`

Update DEX router address.

**Access:** Admin only

### `approveRouter(address token)`

Approve router to spend tokens for liquidity.

**Access:** Admin only

### `transferOwnership(address newOwner)`

Transfer contract ownership.

**Access:** Owner only

## Security Features

### Reentrancy Guards

All state-changing functions protected with reentrancy guards:

```solidity
modifier nonReentrant() {
    require(!locked, "ReentrancyGuard: reentrant call");
    locked = true;
    _;
    locked = false;
}
```

### Creator Limits

- Maximum 20% of curve supply
- Must buy 2% to unlock
- Enforced in `buyTokens()` function

### Unlock Enforcement

- Tokens locked until creator buys 2%
- Public trading blocked during locked state
- Checked in all trading functions

### Valid Token Checks

All functions validate token existence:

```solidity
require(tokens[token].creator != address(0), "Token does not exist");
```

### Exact Fee Checks

Fee calculations verified:

```solidity
require(fee == (amount * 2) / 100, "Fee calculation error");
```

### Router Validation

Router address validated before use:

```solidity
require(router != address(0), "Router not set");
```

## Storage Mappings

```solidity
mapping(address => TokenInfo) public tokens;
mapping(address => address) public tokenCreators;
mapping(address => Comment[]) public comments;
address[] public allTokens;
```

## Constants

- `TREASURY_FEE_BPS = 200` (2%)
- `COMMENT_FEE = 0.025 ether`
- `CURVE_SUPPLY_PERCENT = 70` (70% for curve)
- `LIQUIDITY_SUPPLY_PERCENT = 30` (30% for liquidity)
- `CREATOR_UNLOCK_PERCENT = 2` (2% unlock requirement)
- `CREATOR_MAX_PERCENT = 20` (20% max purchase)

## Next Steps

- Review [API Integration](./api-integration) for frontend usage
- Check [Security](./security) for best practices
- See [Deployment Workflow](./deployment-workflow) for setup

