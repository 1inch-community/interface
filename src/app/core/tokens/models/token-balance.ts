import {Address} from "viem";

export interface TokenBalance {
    id: string
    tokenAddress: Address
    walletAddress: Address
    chainId: number
    amount: string
}
