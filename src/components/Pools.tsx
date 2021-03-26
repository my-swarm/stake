import React, { ReactElement, useEffect, useState } from 'react';

import { pools } from '../config';
import { Pool } from '.';
import { ChefInfo, useContract, useEthers } from '../lib';
import { Col, Row } from 'antd';

export function Pools(): ReactElement {
  const { chef } = useContract();
  const [chefInfo, setChefInfo] = useState<ChefInfo>();

  useEffect(() => {
    if (chef) {
      (async () => {
        setChefInfo({
          totalAllocPoint: (await chef.totalAllocPoint()).toNumber,
          rewardRate: await chef.rewardRate(),
        });
      })();
    }
  }, [chef]);

  return (
    <Row className="mb-4">
      <Col lg={{ span: 20, offset: 2 }} xl={{ span: 16, offset: 4 }}>
        <Row wrap gutter={[24, 24]}>
          {pools.map((pool) => (
            <Col key={pool.id} span={24} md={12}>
              <Pool pool={pool} chefInfo={chefInfo} />
            </Col>
          ))}
        </Row>
        <div className="pools-note">
          <strong>Staking Contract Address</strong>
          <br />
          <a href="https://etherscan.io/address/0xd38abbaec03a9ff287efc9a5f0d0580e07335d1d">
            0xD38abbAeC03a9FF287eFc9a5F0d0580E07335D1D
          </a>
        </div>
      </Col>
    </Row>
  );
}
