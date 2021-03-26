import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Card, Dropdown, Input, Space, Statistic, Alert, Row, Col, Divider } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { BigNumber } from '@ethersproject/bignumber';

import { constants } from '../config';
import {
  DepositWithdrawAction,
  PoolInfo,
  ChefInfo,
  PoolMeta,
  useEthers,
  useContract,
  useBalances,
  normalizePoolInfo,
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
  const balances = useBalances();
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
    return pendingReward ? formatNumber(formatUnits(pendingReward), 4) : 'N/A';
  }

  function formatStaked() {
    return staked ? formatNumber(formatUnits(staked), 2) : 'N/A';
  }

  function formatBalance() {
    return 'N/A';
    //return balances && balances[pool.id] ? formatNumber(formatUnits(balances[pool.id]), 2) : 'N/A';
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
        <Card>
          <Row className="poolHeader">
            <Col span={18} className="pool-header-left">
              <Space>
                <div className="pool-title">{pool.name}</div>
                {pool.id !== 0 && (
                  <a className="pool-add-liquidity" href="https://app.uniswap.org">
                    Add liquidity to Uniswap
                  </a>
                )}
              </Space>
            </Col>
            <Col span={6} className="pool-header-right">
              {poolInfo.allocPoint}× rewards
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={12}>
              <div className="pool-image">
                <img src={`/${pool.icon}`} alt="Token symbol" />
              </div>
            </Col>
            <Col span={12}>
              <div className="pool-info">
                <div className="pool-apy">APY: {apy}%</div>
                {pool.description && <p>{pool.description}</p>}
              </div>

              <div className="earned">
                <div className="earned-label">SWM Earned</div>
                <div className="earned-amount">
                  {formatPendingReward()} <span className="unit">SWM</span>
                </div>
                <div className="earned-button">
                  <Button onClick={handleClaim} disabled={!pendingReward || pendingReward.eq(0)}>
                    {action === 'claim' ? 'Claiming...' : 'Claim'}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col>
              <div className="stake">
                <h3 className="stake-title">Stake your {pool.tokenSymbol} tokens to earn SWM rewards</h3>
                {isApproved ? (
                  <>
                    <div className="stake-balance">
                      <Space>
                        <span>Available: {formatBalance()}</span>
                        <span>Staked: {formatStaked()}</span>
                      </Space>
                    </div>
                    <div className="stake-form">
                      <Space size="small">
                        <Input
                          className="stake-input"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          suffix={
                            <Button type="link" onClick={handleMax} size="small" className="stake-max">
                              Max
                            </Button>
                          }
                        />
                        <Dropdown.Button
                          overlay={<PoolDepositWithdrawMenu onChange={handleSetDwAction} />}
                          icon={<DownOutlined />}
                          onClick={handleDepositWithdraw}
                        >
                          {dwButtonTitle()}
                        </Dropdown.Button>
                      </Space>
                    </div>
                  </>
                ) : (
                  <Button onClick={handleApprove}>
                    {action === 'approve' ? 'Approving...' : `Approve ${pool.tokenSymbol}`}
                  </Button>
                )}
              </div>

              {!!error && (
                <>
                  <Divider />
                  <Alert type="error" message={error.message} />
                </>
              )}
            </Col>
          </Row>
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  );
}
