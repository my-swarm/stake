import React, { ReactElement, useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { Alert } from 'antd';
import { useContract, useEthers } from '../lib';

export function UpgradeAnnouncement(): ReactElement {
  const [stakedV1, setStakedV1] = useState<BigNumber>(BigNumber.from('0'));
  const contracts = useContract();
  const { address, networkId } = useEthers();
  const { chefV1 } = contracts;

  useEffect(() => {
    if (address && networkId && chefV1) {
      chefV1.userInfo(0, address).then((x1) => {
        chefV1.userInfo(1, address).then((x2) => {
          setStakedV1(x1.amount.add(x2.amount));
        });
      });
    }
  }, [address, networkId, chefV1]);

  if (stakedV1.eq(0)) return null;

  return (
    <Alert
      type="warning"
      style={{ textAlign: 'left', maxWidth: '60rem', margin: '0 auto 1.5rem auto' }}
      message={
        <>
          <h2>Attention, Staking contract has been upgraded</h2>
          <p>
            An issue was identified in the contract code effectively locking the contract. What does it mean for your
            tokens?
          </p>
          <ul>
            <li>
              <strong>Staked tokens</strong> (SWM in Pool #1 and SWM/ETH LP in Pool #2) can be withdrawn with the
              <code>emergencyWithdraw</code> method. Your wallet has staked in one of our pools so please use the{' '}
              <strong>Withdraw from old contract</strong> button and then restake with the normal stake form to use the
              new contract.
            </li>
            <li>
              <strong>Unclaimed rewards</strong> are locked forever unfortunately, but we'll compensate those involved
              with an airdrop of the matching amount, so no worry. The SWM you should have received as rewards will just
              land in your wallet.
            </li>
          </ul>
          <p>
            We are sorry for the inconvenience and we thank you for staying with us! Please follow our{' '}
            <a href="https://t.me/joinchat/G8Tp9xgq2FpCSuKs6W4IXg" target="_blank" rel="noreferrer noopener">
              telegram
            </a>{' '}
            for questions and updates.
          </p>
        </>
      }
    />
  );
}
