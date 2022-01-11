export enum EthereumNetwork {
  Main = 1,
  Polygon = 137,
}

export const ethereumNetworks = {
  [EthereumNetwork.Main]: 'Mainnet',
  [EthereumNetwork.Polygon]: 'Polygon',
}

export const etherscanDomains = {
  [EthereumNetwork.Main]: 'etherscan.io',
  [EthereumNetwork.Polygon]: 'polygonscan.com',
};

export type ContractType = 'chefV1' | 'chef' | 'erc20' | 'uniPair';
export type ContractName = 'chefV1' | 'chef' | 'swm' | 'swmLp';

export type AddressConfig = Record<EthereumNetwork, Partial<Record<ContractName, string>>>;

export const networkToken: Record<EthereumNetwork, string> = {
  [EthereumNetwork.Main]: 'ETH',
  [EthereumNetwork.Polygon]: 'MATIC',
}

export function getNetwork(id: EthereumNetwork): string | null {
  return ethereumNetworks[id] || null;
}
