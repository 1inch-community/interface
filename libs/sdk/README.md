# @one-inch-community/sdk

The `@one-inch-community/sdk` module is the core implementation of all business logic for the swap interface and serves as the key module of the entire application. It consists of the following submodules:

## Submodules

- **api**: Handles interactions with the 1inch Dev Portal API and the Fusion SDK.

- **chain**: Implements a wide range of on-chain logic to simplify interaction with the Web3 environment.

- **swap**: Contains the logic for token swaps via the Fusion Protocol.

- **token**: Manages various interactions with tokens, including storing token collections for different chains, maintaining and updating balances, and implementing on-chain rate loading for various token pairs using protocols based on Uniswap V2/V3.

- **wallet**: Provides a system for interacting with Web3 wallets, including support for WalletConnect.

## Purpose

The `@one-inch-community/sdk` module is the backbone of the application's business logic, particularly focusing on the swap functionality. It integrates with external APIs, manages on-chain interactions, handles token operations, and facilitates wallet connections, making it indispensable for the application's overall functionality.

## Key Features

- **API Integration**: Seamless interaction with 1inch's Dev Portal API and Fusion SDK, enabling the core functionality of the swap interface.

- **On-Chain Logic**: Extensive on-chain logic that simplifies interactions with the Web3 environment, ensuring smooth and efficient operations.

- **Token Management**: Comprehensive token management, including balance tracking, token collection storage, and real-time rate updates for token pairs.

- **Swap Logic**: Core logic for executing token swaps using the Fusion SDK, enabling efficient and reliable transactions.

- **Wallet Integration**: Robust system for connecting and interacting with Web3 wallets, with full support for WalletConnect.

The `@one-inch-community/sdk` module is essential for enabling the core functionalities of the swap interface, providing all necessary business logic, and integrating seamlessly with other parts of the application.
