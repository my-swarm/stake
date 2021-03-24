import { PoolMeta } from '../lib';

export const pools: PoolMeta[] = [
  {
    id: 0,
    code: 'swm',
    icon: 'swarm-coin-orange.png',
    name: 'Swarm Pool',
    tokenSymbol: 'SWM',
    description: "For the cautions. Stake SWM and receive SWM, no risk, it's that simple.",
  },

  {
    id: 1,
    code: 'swmLp',
    icon: 'swarm-coin-black.png',
    name: 'LP Pool',
    tokenSymbol: 'SWM/ETH LP',
    description: 'Stake the SWM/ETH LP token and receive way more SWM. More risk, more reward!',
  },
];
