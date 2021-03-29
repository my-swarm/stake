import { BigNumber } from '@ethersproject/bignumber';

export const constants = {
  maxAllowance: BigNumber.from(2).pow(256).sub(1),
  secondsYear: 365 * 24 * 3600,
  secondsRewardPeriod: 30 * 24 * 3600,
};
