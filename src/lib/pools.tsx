import { BigNumber } from '@ethersproject/bignumber';

export interface PoolMeta {
  id: number;
  name: string;
  tokenSymbol: string;
  code: string;
  icon: string;
  description: string;
}

export interface PoolInfo {
  token: string;
  allocPoint: number;
  lastUpdateTime: Date;
  accRewardPerShare: BigNumber;
  totalStaked: BigNumber;
  accUndistributedReward: BigNumber;
}

export interface UserInfo {
  amountStaked: BigNumber;
  pendingReward: BigNumber;
}

export function normalizePoolInfo(pi: any): PoolInfo {
  const { accRewardPerShare, accUndistributedReward, allocPoint, lastUpdateTime, token, totalStaked } = pi as PoolInfo;

  return {
    accRewardPerShare,
    accUndistributedReward,
    allocPoint: ((allocPoint as unknown) as BigNumber).toNumber(),
    lastUpdateTime: new Date(lastUpdateTime),
    token,
    totalStaked,
  };
}

export type DepositWithdrawAction = 'deposit' | 'withdraw';

export interface ChefInfo {
  totalAllocPoint: number;
  rewardRate: BigNumber;
}