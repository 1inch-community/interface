import { Repository } from './repository.model';
import { ChainId } from '@one-inch-community/models';
import { getAddress } from 'viem/utils';

const chainName: Record<ChainId, string> = {
    [ChainId.eth]: 'eth'
}

export const pancakeSwapRepository: Repository = ({ address, chainId }) => {
    return new Promise((resolve, reject) => {
        if (!address || !chainId) return reject();
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `https://tokens.pancakeswap.finance/images/${chainName[chainId]}/${getAddress(address.toLowerCase())}.png`;
    });
};
