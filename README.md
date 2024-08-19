# 1inch Community Swap Interface

This project implements a swap interface and SDK based on the 1inch Fusion protocol. Its goal is to make the token
exchange process more transparent, secure, and user-friendly. The project also provides the ability to integrate the
swap form directly into other applications, which can greatly improve the user experience.

## Table of Contents

1. [Project Structure](#project-structure)
    - [Core](#core)
    - [Integration Layer](#integration-layer)
    - [Models](#models)
    - [SDK](#sdk)
    - [UI Components](#ui-components)
    - [Widgets](#widgets)
    - [Applications](#applications)
2. [Dapp Development Preparation](#dapp-development-preparation)
3. [Running Dapp for Development](#running-dapp-for-development)
4. [Running Embedded for Development](#running-embedded-for-development)
5. [Important Note](#important-note)

## Project Structure

The project is implemented using the Lit library for HTML rendering and is built on a modular architecture, making the
development process flexible and extensible. The main set of modules is located in the `libs` directory:

### [Core](libs/core/readme.md)

A module that handles tasks not related to the business logic of the application. It simplifies the development process
and systematizes some processes.

### [Integration Layer](libs/integration-layer/readme.md)

A module responsible for integrating widgets into various runtime environments. It implements the logic for both
monolithic applications and embedded widgets.

### [Models](libs/models/readme.md)

A module for models that doesn’t carry any logical payload. It solves the problem of loose coupling between modules
through interfaces.

### [SDK](libs/sdk/readme.md)

The main business logic module, simplifying the work with Web3 networks and encapsulating the Fusion Swap logic.

### [UI Components](libs/ui-components/readme.md)

A module that implements reusable UI components without any business logic.

### [Widgets](libs/widgets/readme.md)

The main module that implements complex widgets like swap forms, wallet connection, and others. It presents business
logic through UI.

### Applications

The project also includes two applications in the [`apps`](apps) directory:

- [**dapp**](apps/dapp): A monolithic application that binds widgets together. Its main task is to display widgets on the user's
  screen depending on the type of device.
- [**electron-dapp**](apps/electron-dapp): A wrapper for the regular dapp in Electron.

## Development Preparation

The project uses the Dev Portal API. To start development, you need to create an API key on
the [1inch Dev Portal](https://portal.1inch.dev/). After obtaining the key, run the following command to create the
`.env` file:

```bash
cp env.example .env
```

Then, in the `.env` file, specify the received token in the `ONE_INCH_DEV_PORTAL_TOKEN` field.

It’s important to remember that for the production application to work, a full proxy is required, as the CORS policy of
the 1inch Dev Portal does not allow direct interaction with the API.

If you plan to use WalletConnect for wallet connections, you should obtain keys for WalletConnect and specify them in
the `WALLET_CONNECT_PROJECT_ID` field in the `.env` file.

Additionally, if necessary, you can provide an Infura key to improve the stability of the application by specifying it
in the `INFURA_API_KEY` field. However, this is optional since the application already includes a significant set of
public Web3 nodes.

You can also start your proxy by running the command:
```bash
docker build -t one-inch-proxy .
docker run -d -p 8080:80 -e TOKEN="{{YOU TOKEN FROM DEV PORTAL}}" one-inch-proxy
```

## Running Dapp for Development

1. **Clone the Git repository to your local machine:**

   ```bash
   git clone git@github.com:1inch-community/interface.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd interface
   ```

3. **Install the dependencies:**

   ```bash
   pnpm install
   ```

4. **Verify the build of all modules:**

   After installation, `postinstall` should build all modules for further execution. Verify this by checking for the
   presence of the [`dist/libs`](./dist/libs) directory. It should contain all the built modules of the project. If this directory is
   missing or empty, you can manually run the build:

   ```bash
   nx run one-inch-community:postinstall
   ```

   This command will build all dependencies and prepare the project for execution.

5. **Start the dev server:**

   To start the dev server, run the following command:

   ```bash
   nx run dapp:serve
   ```

6. **Open the application in your browser:**

   Navigate to `http://localhost:4200/` in your browser.

7. **Optional: Start the library build in watch mode:**

   To start the library build in watch mode, run:

   ```bash
   nx run one-inch-community:watch-all-libs
   ```

   This script will start the build of all modules and automatically rebuild them when the source files change.

## Running Embedded for Development

Follow all the steps up to 4 from the [Running Dapp for Development](#running-dapp-for-development) section. Then, navigate to the integration example
that interests you in the [`examples`](./examples) directory and follow the steps outlined in the README file of the specific example
project.

## Important Note

Avoid importing modules into themselves. For example, when working in the `@one-inch-community/models` module, you
should not use an import alias like:

```ts
import "@one-inch-community/models"
```

Such an import will prevent the bundler from resolving it, and you will need to restart the watch build.
