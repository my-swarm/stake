import React, { ReactElement, useEffect, useState } from 'react';

import { contractAddresses, pools } from '../config';
import { Pool } from '.';
import { ChefInfo, etherscanDomains, useContract, useEthers } from '../lib';
import { Col, Row } from 'antd';

export function Pools(): ReactElement {
  const { chef } = useContract();
  const [chefInfo, setChefInfo] = useState<ChefInfo>();
  const { networkId } = useEthers();

  const etherscanDomain = etherscanDomains[networkId] ?? null;
  const stakingContractAddress = contractAddresses[networkId].chef;

  useEffect(() => {
    if (chef) {
      (async () => {
        try {
          setChefInfo({
            totalAllocPoint: (await chef.totalAllocPoint()).toNumber,
            rewardRate: await chef.rewardRate(),
          });
        } catch (e) {}
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
              href={`https://${etherscanDomain}/address/${stakingContractAddress}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {stakingContractAddress}
            </a>
          </div>
        </Col>
      </Row>
    </>
  );
}
