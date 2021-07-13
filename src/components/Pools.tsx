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

  return (
    <>
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
              href="https://etherscan.io/address/0xe13c0ec78d283eb8cca72edd018a9c13ad0e002a"
              target="_blank"
              rel="noreferrer noopener"
            >
              0xE13c0Ec78D283eb8Cca72Edd018a9c13AD0E002a
            </a>
          </div>
        </Col>
      </Row>
    </>
  );
}
