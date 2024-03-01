import { Repository } from './repository.model';

export const oneInchRepository: Repository = ({ address }) => {
    return new Promise((resolve, reject) => {
        if (!address) return reject();
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `https://tokens-data.1inch.io/images/${address.toLowerCase()}.png`;
    });
};
