# @one-inch-community/widgets

The `@one-inch-community/widgets` module is one of the key modules in the application. It serves as the visual embodiment of the SDK, implementing large UI components that contain significant business logic related to token swaps, token management, and interactions with Web3 wallets. This module is composed of the following submodules:

## Submodules

- **notification**: Although it doesn't contain a lot of business logic, this submodule is a crucial part of the application, aimed at enhancing transparency and user awareness of the application's operations.

- **select-token**: Implements the interface for interacting with token lists across various chains, allowing users to efficiently select and manage tokens.

- **swap-form**: The central submodule of the entire application, it directly implements the swap form and all its visual components, handling the core swap logic.

- **token-icon**: A small submodule that handles the loading and caching of token icons for different networks, ensuring that token representations are accurate and readily available.

- **wallet-manager**: A set of visual components that implement the logic for connecting to Web3 wallets, providing users with seamless wallet integration.

## Purpose

The `@one-inch-community/widgets` module plays a crucial role in bringing the business logic of the SDK to life through its visual components. By integrating complex UI elements with underlying business processes, it provides a cohesive and user-friendly interface that simplifies the interactions with tokens, swaps, and Web3 wallets.

## Key Features

- **Visual Representation of SDK**: Serves as the UI layer for the SDK, integrating complex business logic into easy-to-use components.

- **Centralized Swap Logic**: The `swap-form` submodule acts as the heart of the application, managing all aspects of the token swap process.

- **Token Management**: Provides intuitive interfaces for selecting and managing tokens across different chains, enhancing the user experience.

- **Web3 Wallet Integration**: The `wallet-manager` submodule ensures smooth and secure connections with Web3 wallets, supporting various wallet types.

- **Transparency and User Awareness**: Through the `notification` submodule, the application communicates important information to users, improving transparency and trust.

The `@one-inch-community/widgets` module is essential for delivering a robust and user-friendly interface that effectively integrates with the application's core business logic, making complex processes like token swaps and wallet management accessible to users.
