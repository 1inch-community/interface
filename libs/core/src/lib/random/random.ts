export const genRandomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
export const genRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
