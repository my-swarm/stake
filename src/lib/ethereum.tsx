export enum EthereumNetwork {
  Main = 1,
  Kovan = 42,
  Xdai = 100,
  Hardhat = 31337,
}

export const etherscanDomains = {
  [EthereumNetwork.Main]: 'etherscan.io',
  [EthereumNetwork.Xdai]: 'blockscout.com/poa/xdai',
  [EthereumNetwork.Hardhat]: 'etherscan.l',
};

export type ContractType = 'chef' | 'erc20' | 'uniPair';
export type ContractName = 'chef' | 'swm' | 'swmLp';

export type AddressConfig = Record<EthereumNetwork, Record<ContractName, string>>;

export function getNetwork(id: EthereumNetwork): string | null {
  switch (id) {
    case EthereumNetwork.Hardhat:
      return 'Hardhat';
    case EthereumNetwork.Main:
      return 'Mainnet';
    case EthereumNetwork.Kovan:
      return 'Kovan';
    case EthereumNetwork.Xdai:
      return 'xDai';
  }
  return null;
}
