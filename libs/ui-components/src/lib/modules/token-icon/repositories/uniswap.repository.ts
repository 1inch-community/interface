import { Repository } from './repository.model';
import { ChainId } from '@one-inch-community/models';
import { getAddress } from 'viem/utils';

const chainName: Record<ChainId, string> = {
    [ChainId.eth]: 'ethereum'
}

export const uniSwapRepository: Repository = ({ address, chainId }) => {
    return new Promise((resolve, reject) => {
        if (!address || !chainId) return reject();
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${chainName[chainId]}/assets/${getAddress(address.toLowerCase())}/logo.png`;
    });
};
