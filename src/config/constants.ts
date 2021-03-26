import { BigNumber } from '@ethersproject/bignumber';

export const constants = {
  maxAllowance: BigNumber.from(2).pow(256).sub(1),
  secondsYear: 24 * 3600 * 365,
};
