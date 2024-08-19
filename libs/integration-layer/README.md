# @one-inch-community/integration-layer

The `@one-inch-community/integration-layer` module implements a system for integrating widgets into the runtime environment and includes two main strategies:

## Strategies

- **Application**: This strategy is designed for monolithic integration, which is necessary to run a full-fledged swap interface. It is less flexible and is intended primarily for use as a Single Page Application (SPA), but it is more optimized in terms of resource consumption.

- **Embedded**: This strategy allows for the flexible embedding of various application widgets into different parts of a larger host application. It operates independently of the host application's frameworks and other widgets, creating its own isolated execution context for each module. While this approach provides greater flexibility, it is more resource-intensive since each module creates its own isolated execution context.

## Purpose

The `@one-inch-community/integration-layer` module is essential for integrating widgets into different runtime environments, providing two distinct strategies tailored to specific use cases. Whether the goal is to optimize resource consumption in a monolithic application or to achieve flexibility and independence in an embedded environment, this module provides the necessary tools to ensure seamless integration.

## Key Features

- **Monolithic Integration (Application)**: Optimized for resource efficiency, this strategy is ideal for scenarios where the swap interface is the primary focus of the application.

- **Widget Embedding (Embedded)**: Offers maximum flexibility, allowing widgets to be embedded into larger applications regardless of the host framework. Each widget runs in its isolated context, making this approach more resource-intensive but highly modular.

The `@one-inch-community/integration-layer` module is crucial for creating flexible and efficient integration solutions, tailored to the specific needs of your application architecture.
