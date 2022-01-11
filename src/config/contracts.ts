import { AddressConfig, ContractName, ContractType, EthereumNetwork } from '../lib';

export const contractAddresses: AddressConfig = {
  [EthereumNetwork.Main]: {
    chefV1: '0xD38abbAeC03a9FF287eFc9a5F0d0580E07335D1D',
    chef: '0xE13c0Ec78D283eb8Cca72Edd018a9c13AD0E002a',
    swm: '0x3505F494c3f0fed0B594E01Fa41Dd3967645ca39',
    swmLp: '0xe0b1433E0174b47E8879EE387f1069a0dBf94137',
  },
  [EthereumNetwork.Polygon]: {
    chef: '0x6a660A81201dF3E6eF65Cb79e925e9B66324A40D',
    swm: '0x3505F494c3f0fed0B594E01Fa41Dd3967645ca39',
    swmLp: '0x644ff224f291dc30cadadc6b66d5dac21c3560bf',
  },
};

export const contractTypes: Record<ContractName, ContractType> = {
  chef: 'chef',
  chefV1: 'chefV1',
  swm: 'erc20',
  swmLp: 'erc20',
};
