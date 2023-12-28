import {Address, isAddressEqual} from "viem";

export function isNativeTokenContract(contract: Address): boolean {
    return isAddressEqual('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', contract)
}
