import { AddressConfig, ContractName, ContractType, EthereumNetwork } from '../lib';

export const contractAddresses: AddressConfig = {
  [EthereumNetwork.Main]: { chef: '0xfasdf', swm: '0xfasdf', swmLp: '0xfasdf' },
  [EthereumNetwork.Kovan]: {
    chef: '0xde0EBBbcB678C15D10DB1c21449C9bd91D4Ad8d0',
    swm: '0x46874BfC5Ed8D1c238F615Bb95c13b99994Aa578',
    swmLp: '0x6536840926CcCC2de3baEAdC991f7e0ADe897d70',
  },
  [EthereumNetwork.Xdai]: { chef: '0xfasdf', swm: '0xfasdf', swmLp: '0xfasdf' },
  [EthereumNetwork.Hardhat]: {
    chef: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    swm: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    swmLp: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
};

export const contractTypes: Record<ContractName, ContractType> = {
  chef: 'chef',
  swm: 'erc20',
  swmLp: 'erc20',
};
