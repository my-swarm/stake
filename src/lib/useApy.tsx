import { useEffect } from 'react';
import { useContract, useCustomContract } from './useContract';
import { BigNumber } from '@ethersproject/bignumber';

import { constants, pools } from '../config';
import { useState } from 'react';

export function useLpApy(contractKey) {
  const [apy, setApy] = useState<BigNumber>();
  const poolMeta = pools.find((x) => x.code === contractKey);
  const { id: pid, lpContractAddress } = poolMeta;
  const uniPair = useCustomContract('uniPair', lpContractAddress);
  const { chef } = useContract();

  useEffect(() => {
    (async () => {
      if (!uniPair) return;

      const totalSupply = await uniPair.totalSupply();
      const [reserveSwm, reserveEth] = await uniPair.getReserves();
      const swmPerLp = totalSupply.div(reserveSwm);
      const poolInfo = await chef.poolInfo(pid);
      const chefRewardRate = await chef.rewardRate();
      if (chefRewardRate.eq(0)) {
        setApy(undefined);
      } else {
        const rewardRate = chefRewardRate.mul(poolInfo.allocPoint).div(await chef.totalAllocPoint());
        const rewardPerYear = rewardRate.mul(constants.secondsYear);
        const swmEquivalentStaked = poolInfo.totalStaked.mul(swmPerLp).mul(2);
        const apy = swmEquivalentStaked.div(rewardPerYear);
        setApy(apy);
      }
    })();
  }, [uniPair]);

  return apy;
  /*
    LP contract 0xe0b1433e0174b47e8879ee387f1069a0dbf94137
    get totalSupply() = 12969878237850658189394
    get getReserves() =
    _reserve0|uint112 :  2283618879270623919944306 (SWM)
    _reserve1|uint112 :  92353897366801349374 (ETH)
    Calculate SWM per LP = lpRate = totalSupply.div(SWM) = 176
    poolRewardRate = rewardRate*poolInfo(1).allocPoint/totalAllocPoint
    poolRewardYear = poolRewardRate*86400*365
    SWMEquivalentStaked = poolInfo(1).totalStaked()*lpRate*2
    APY = SWMEquivalentStaked/poolRewardYear
 */
}

export function useSwmApy() {
  return undefined;
  /*
    poolRewardRate = rewardRate*poolInfo(0).allocPoint/totalAllocPoint
    poolRewardYear = poolRewardRate*86400*365
    APY = poolInfo(0).totalStaked()/poolRewardYear
   */
}
