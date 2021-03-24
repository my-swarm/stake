import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Card, Dropdown, Input, Space, Statistic, Alert, Row, Col, Divider } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { BigNumber } from '@ethersproject/bignumber';

import { constants } from '../config';
import {
  DepositWithdrawAction,
  normalizePoolInfo,
  PoolInfo,
  ChefInfo,
  PoolMeta,
  useContract,
  useEthers,
  parseUnits,
  formatUnits,
  formatNumber,
} from '../lib';
import { Loading, PoolDepositWithdrawMenu } from '.';

interface Props {
  chefInfo: ChefInfo;
  pool: PoolMeta;
}

type Action = 'approve' | 'claim' | 'withdraw' | 'deposit';

export function Pool({ pool, chefInfo }: Props): ReactElement {
  const tokenPrice = 0.2;
  const { address, networkId } = useEthers();
  const [ts, setTs] = useState<number>(Date.now());
  const [isApproved, setApproved] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [action, setAction] = useState<Action>();
  const [pendingReward, setPendingReward] = useState<BigNumber>();
  const [staked, setStaked] = useState<BigNumber>();
  const [poolInfo, setPoolInfo] = useState<PoolInfo>();
  const [dwAction, setDwAction] = useState<DepositWithdrawAction>('deposit');
  const [amount, setAmount] = useState<string>('');
  const [apy, setApy] = useState<string>('N/A');
  const contracts = useContract();
  const { chef } = contracts;
  const token = contracts[pool.code];

  useEffect(() => {
    if (address && networkId && chef) {
      chef.poolInfo(pool.id).then((pi) => {
        setPoolInfo(normalizePoolInfo(pi));
      });
      chef.pendingReward(pool.id, address).then((x) => {
        setPendingReward(x);
      });
      chef.userInfo(pool.id, address).then((x) => {
        setStaked(x.amount);
      });
    }
  }, [address, networkId, chef, pool.id, ts]);

  useEffect(() => {
    if (token && address) {
      token.allowance(address, chef.address).then((allowance) => {
        // shoud probably explain this. Well, max allowance is so huge, that half is still huge. So we just assume
        // anyone who has over half has unlimited and no one can actually lower to half by normal transactions
        if (allowance.gt(constants.maxAllowance.div(2))) {
          setApproved(true);
        }
      });
    }
  }, [token, address, chef]);

  useEffect(() => {
    if (tokenPrice && poolInfo) {
      const usdPerSecond = tokenPrice * poolInfo.allocPoint;
      const yearlyReturn = 12;
      setApy('123');
    }
  }, [tokenPrice, poolInfo, chefInfo]);

  const reload = () => {
    setTs(Date.now());
    setAction(undefined);
    setAmount('');
  };

  const handleClaim = () => {
    setError(undefined);
    setAction('claim');
    chef
      .withdraw(pool.id, 0)
      .then((tx) => tx.wait())
      .then(reload)
      .catch(handleError);
  };

  const handleApprove = () => {
    setError(undefined);
    setAction('approve');
    token
      .approve(chef.address, constants.maxAllowance)
      .then((tx) => tx.wait())
      .then(() => {
        setAction(undefined);
        setApproved(true);
      })
      .catch(handleError);
  };

  const handleMax = () => {
    if (dwAction === 'deposit') {
      token.balanceOf(address).then((amount) => setAmount(formatUnits(amount)));
    } else {
      setAmount(formatUnits(staked));
    }
  };

  const handleError = (err: any) => {
    setAction(undefined);
    setError(err);
  };

  const handleDepositWithdraw = () => {
    setError(undefined);
    setAction(dwAction);
    chef[dwAction](pool.id, parseUnits(amount))
      .then((tx) => tx.wait())
      .then(reload)
      .catch(handleError);
  };

  const handleSetDwAction = (action) => {
    setDwAction(action);
    setAmount('');
  };

  function formatPendingReward() {
    return pendingReward ? formatNumber(formatUnits(pendingReward), 2) : 'N/A';
  }

  function formatStaked() {
    return staked ? formatNumber(formatUnits(staked), 2) : 'N/A';
  }

  function dwButtonTitle() {
    if (dwAction === 'deposit') {
      return action === 'deposit' ? 'Depositing...' : 'Deposit';
    } else {
      return action === 'withdraw' ? 'Withdrawing...' : 'Withdraw';
    }
  }

  return (
    <div className="pool">
      {poolInfo ? (
        <Card title={pool.name} extra={`${poolInfo.allocPoint}× rewards`}>
          <div className="pool-info">
            <div className="pool-image">
              <img src={`/${pool.icon}`} alt="Token symbol" />
            </div>
            <div className="pool-apy">APY: {apy}%</div>
            <p>{pool.description}</p>
          </div>
          <Divider />
          <Row gutter={24}>
            <Col sm={12} style={{ textAlign: 'right' }}>
              <Statistic title="SWM earned" value={formatPendingReward()} className="stat-earned" />
            </Col>
            <Col sm={12}>
              <Button onClick={handleClaim} disabled={!pendingReward || pendingReward.eq(0)}>
                {action === 'claim' ? 'Claiming...' : 'Claim SWM'}
              </Button>
            </Col>
          </Row>
          <Divider />
          <Row gutter={24}>
            <Col sm={12} style={{ textAlign: 'right' }}>
              <Statistic title={`${pool.tokenSymbol} staked`} value={formatStaked()} className="stat-staked" />
            </Col>
            <Col sm={12}>
              {isApproved ? (
                <>
                  <div className="pool-input">
                    <Input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      suffix={
                        <Button type="link" onClick={handleMax} size="small">
                          max
                        </Button>
                      }
                    />
                  </div>
                  <Dropdown.Button
                    overlay={<PoolDepositWithdrawMenu onChange={handleSetDwAction} />}
                    icon={<DownOutlined />}
                    onClick={handleDepositWithdraw}
                  >
                    {dwButtonTitle()}
                  </Dropdown.Button>
                </>
              ) : (
                <>
                  <Space direction="vertical">
                    <Button onClick={handleApprove}>
                      {action === 'approve' ? 'Approving...' : `Approve ${pool.tokenSymbol}`}
                    </Button>
                    <Dropdown.Button
                      overlay={<span />}
                      icon={<DownOutlined />}
                      onClick={handleDepositWithdraw}
                      disabled={true}
                    >
                      {dwButtonTitle()}
                    </Dropdown.Button>
                  </Space>
                </>
              )}
            </Col>
          </Row>
          {!!error && (
            <>
              <Divider />
              <Row style={{ width: '100%' }}>
                <Col>
                  <Alert type="error" message={error.message} />
                </Col>
              </Row>
            </>
          )}
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  );
}
