import { useEffect, useState } from 'react';
import { useContract, useCustomContract } from './useContract';
import { BigNumber } from '@ethersproject/bignumber';

import { constants, pools } from '../config';

const precision = BigNumber.from(10).pow(18);
const outputPrecision = 10000;

export function useLpApy(contractKey) {
  const [apy, setApy] = useState<number>();
  const poolMeta = pools.find((x) => x.code === contractKey);
  const { id: pid, lpContractAddress } = poolMeta;
  const uniPair = useCustomContract('uniPair', lpContractAddress);
  const { chef } = useContract();

  useEffect(() => {
    return;

    if (!uniPair || !chef) return;
    (async () => {
      const rewardRate = await chef.rewardRate(); // SWM + 18 precision
      const totalAllocPoint = await chef.totalAllocPoint();
      const { allocPoint, totalStaked } = await chef.poolInfo(pid);
      if (totalStaked.eq(0)) return;

      const totalSupply = await uniPair.totalSupply(); // LP tokens
      const [reserveSwm] = await uniPair.getReserves(); // SWM
      const swmPerLp = reserveSwm.mul(precision).div(totalSupply); // SWM + 18 precision
      if (rewardRate.gt(0)) {
        const poolRewardRate = rewardRate.mul(allocPoint).div(totalAllocPoint); // SWM + 18 precision
        const rewardPerYear = poolRewardRate.mul(constants.secondsYear); // SWM + 18 precision
        const swmEquivalentStaked = totalStaked.mul(swmPerLp).mul(2).div(precision); // SWM
        const apy =
          (rewardPerYear.div(swmEquivalentStaked).mul(outputPrecision).div(precision).toNumber() / outputPrecision) *
          100;
        setApy(apy);
      }
    })();
  }, [chef, pid, uniPair]);

  return apy;
}

export function useSwmApy() {
  const { chef } = useContract();
  const [apy, setApy] = useState<number>();

  useEffect(() => {
    return;
    if (!chef) return;

    (async () => {
      const rewardRate = await chef.rewardRate(); // SWM + 18 precision
      const totalAllocPoint = await chef.totalAllocPoint();
      const { allocPoint, totalStaked } = await chef.poolInfo(0);
      if (totalStaked.eq(0)) return;

      const poolRewardRate = rewardRate.mul(allocPoint).div(totalAllocPoint);
      const rewardPerYear = poolRewardRate.mul(constants.secondsYear); // +18 precision
      const apy =
        (rewardPerYear.div(totalStaked).mul(outputPrecision).div(precision).toNumber() / outputPrecision) * 100;
      setApy(apy);
    })();
  }, [chef]);

  return apy;
}
