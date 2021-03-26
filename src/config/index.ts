export * from './pools';
export * from './constants';
export * from './contracts';

export const ethProvider = {
  url: process.env.REACT_APP_JSON_RPC_PROVIDER_URL,
  chainId: parseInt(process.env.REACT_APP_JSON_RPC_PROVIDER_CHAIN_ID),
};
