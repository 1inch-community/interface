import { ChainId } from '@one-inch-community/models';
import { Repository } from './repository.model';

export const oneInchRepository: Repository = ({ address, chainId }) => {
    return new Promise((resolve, reject) => {
        if (!address || chainId !== ChainId.eth) return reject();
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `https://tokens-data.1inch.io/images/${address.toLowerCase()}.png`;
    });
};
