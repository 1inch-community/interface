import { Repository } from './repository.model';
import { getAddress } from 'viem/utils';

export const sushiSwapRepository: Repository = ({ address, chainId }) => {
    return new Promise((resolve, reject) => {
        if (!address || !chainId) return reject();
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `https://cdn.sushi.com/image/upload/f_auto,c_limit,w_96/d_unknown.png/tokens/${chainId}/${getAddress(address.toLowerCase())}.jpg`;
    });
};
