import React, { ReactElement, useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { Button, Descriptions, Typography } from 'antd';
import { MetamaskStatus } from '.';
import { useContract } from '../lib/useContract';
import { useEthers } from '../lib';

const { Title } = Typography;
const { Item } = Descriptions;

export function Collect(): ReactElement {
  const { distribution } = useContract();
  const { address } = useEthers();
  const [balance, setBalance] = useState<BigNumber>();
  const [timestamp, setTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    if (distribution && address) {
      distribution.rewardOf(address).then((b) => setBalance(b as BigNumber));
    }
  }, [distribution, address, timestamp]);

  const handleCollect = () => {
    distribution.collect().then(() => {
      setTimestamp(Date.now());
    });
  };

  return (
    <div className="collect">
      <Title level={2}>Collect your rewards</Title>
      <Descriptions layout="horizontal" column={1} bordered labelStyle={{ width: '40%' }}>
        <Item label="Ethereum network">
          <MetamaskStatus />
        </Item>
        <Item label="Pending rewards">{balance ? <>{formatUnits(balance)} SWM</> : 'N/A'}</Item>
        <Item label="Click to collect">
          {address ? <Button onClick={handleCollect}>Collect rewards</Button> : 'Please connect first'}
        </Item>
      </Descriptions>
    </div>
  );
}
