import {EIP1193Provider} from "./wallet-provider";

declare global {
    interface Window {
        ethereum?: EIP1193Provider;
    }
}
