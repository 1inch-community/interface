import {ChainId} from "../models";
import {Address} from "viem";
import {getViemChainId} from "./viem-chain-id";

export function buildEtherscanTxLink(chainId: ChainId, txAddress: Address): string | null {
    const chain = getViemChainId(chainId);
    const host = chain.blockExplorers?.default.url;
    if (!host) return null;
    return `${host}/tx/${txAddress}`;
}

export function buildEtherscanAddressLink(chainId: ChainId, address: Address): string | null {
    const chain = getViemChainId(chainId);
    const host = chain.blockExplorers?.default.url;
    if (!host) return null;
    return `${host}/address/${address}`;
}
