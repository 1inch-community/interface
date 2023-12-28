export function isInjectedWalletProvider(): boolean {
    return window.ethereum?.isOneInchWallet ?? false;
}

export function injectedProviderAvailable() {
    return !!(window.ethereum && !!(window.ethereum?.request ?? false));
}
