import { EthereumNetwork, PoolMeta } from '../lib';

export const pools: PoolMeta[] = [
  {
    id: 0,
    code: 'swm',
    icon: 'swarm-coin-orange.png',
    name: 'SWM Pool',
    tokenSymbol: 'SWM',
    description: null,
    allocPoint: 1,
  },

  {
    // id: 1,
    id: 2, // kovan id.
    code: 'swmLp',
    icon: 'swarm-coin-black.png',
    name: 'SWM/ETH Pool',
    tokenSymbol: 'SWM/ETH LP',
    description: null,
    poolLink: 'https://app.uniswap.org/#/add/0x3505f494c3f0fed0b594e01fa41dd3967645ca39/ETH',
    lpContractAddress: {
      [EthereumNetwork.Hardhat]: '0x0',
      [EthereumNetwork.Main]: '0xe0b1433e0174b47e8879ee387f1069a0dbf94137',
      [EthereumNetwork.Kovan]: '0xbb2f4187cecd7676d8aedd8374b02d1b480e77e2',
    },
    allocPoint: 4,
  },
];
