import React, { ReactElement, useEffect, useState } from 'react';

import { pools } from '../config';
import { Pool } from '.';
import { ChefInfo, useContract } from '../lib';
import { Alert, Col, Row } from 'antd';

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

  const startTs = 1617112800;
  const currentTs = Math.floor(Date.now() / 1000);

  return (
    <>
      {startTs > currentTs && (
        <Row className="mb-3">
          <Col style={{ margin: 'auto' }}>
            <Alert message="Rewards distribution will start on 30/03/2021 at 13:00 UTC" type="error" />
          </Col>
        </Row>
      )}
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
            <a
              href="https://etherscan.io/address/0xd38abbaec03a9ff287efc9a5f0d0580e07335d1d"
              target="_blank"
              rel="noreferrer noopener"
            >
              0xD38abbAeC03a9FF287eFc9a5F0d0580E07335D1D
            </a>
          </div>
        </Col>
      </Row>
    </>
  );
}
