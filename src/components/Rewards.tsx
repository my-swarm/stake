import React, { ReactElement, useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { Button } from 'antd';
import { formatUnits, parseUnits, useContract, useEthers } from '../lib';
import { constants } from '../config';

export function Rewards(): ReactElement {
  const { swm, chef } = useContract();
  const [rewards, setRewards] = useState<BigNumber>();
  const [rewardToken, setRewardToken] = useState<string>();
  const { address, networkId } = useEthers();

  useEffect(() => {
    if (chef && address && networkId) {
      chef.rewardTokenBalance().then((balance) => setRewards(balance));
      chef.rewardToken().then((token) => setRewardToken(token));
    }
  }, [chef, address, networkId]);

  const handleApprove = async () => {
    await swm.approve(chef.address, constants.maxAllowance);
    alert('Success!');
  };

  const handleRefill = async () => {
    await chef.updateRewards(parseUnits(50000));
    alert('Success!');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <p>Reward Token: {rewardToken}</p>
      <p>Current amount of rewards: {formatUnits(rewards)}</p>
      <p>
        <Button onClick={handleApprove}>Approve</Button>
        <Button onClick={handleRefill}>Refill Rewards</Button>
      </p>
    </div>
  );
}
