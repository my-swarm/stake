import { PoolMeta } from '../lib';

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
    name: 'SWM/ETH Pool',
    tokenSymbol: 'SWM/ETH LP',
    description: null,
    poolLink: 'http://app.uniswap.org',
    lpContractAddress: '0xe0b1433e0174b47e8879ee387f1069a0dbf94137',
    allocPoint: 4,
  },
];
