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
    id: 1,
    code: 'swmLp',
    icon: 'swarm-coin-black.png',
    name: 'SWM/{networkToken} Pool',
    tokenSymbol: 'SWM/{networkToken} LP',
    description: null,
    poolLink: 'https://app.uniswap.org/#/add/0x3505f494c3f0fed0b594e01fa41dd3967645ca39/ETH',
    lpContractAddress: {
      [EthereumNetwork.Main]: '0xe0b1433e0174b47e8879ee387f1069a0dbf94137',
      [EthereumNetwork.Polygon]: '0x644ff224f291dc30cadadc6b66d5dac21c3560bf',
    },
    allocPoint: 4,
  },
];
