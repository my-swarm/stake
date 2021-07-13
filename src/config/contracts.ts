import { AddressConfig, ContractName, ContractType, EthereumNetwork } from '../lib';

export const contractAddresses: AddressConfig = {
  [EthereumNetwork.Main]: {
    chefV1: '0xD38abbAeC03a9FF287eFc9a5F0d0580E07335D1D',
    chef: '0xE13c0Ec78D283eb8Cca72Edd018a9c13AD0E002a',
    swm: '0x3505F494c3f0fed0B594E01Fa41Dd3967645ca39',
    swmLp: '0xe0b1433E0174b47E8879EE387f1069a0dBf94137',
  },
  //   [EthereumNetwork.Kovan]: {
  //     chefV1: '0xde0EBBbcB678C15D10DB1c21449C9bd91D4Ad8d0',
  //     chef: '0xde0EBBbcB678C15D10DB1c21449C9bd91D4Ad8d0',
  //     swm: '0x46874BfC5Ed8D1c238F615Bb95c13b99994Aa578',
  //     swmLp: '0xBB2F4187cECd7676D8aEdd8374B02D1b480E77E2',
  //   },
  //   // [EthereumNetwork.Xdai]: { chef: '0xfasdf', swm: '0xfasdf', swmLp: '0xfasdf' },
  //   [EthereumNetwork.Hardhat]: {
  //     chefV1: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  //     chef: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  //     swm: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  //     swmLp: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  //   },
};

export const contractTypes: Record<ContractName, ContractType> = {
  chef: 'chef',
  chefV1: 'chefV1',
  swm: 'erc20',
  swmLp: 'erc20',
};
