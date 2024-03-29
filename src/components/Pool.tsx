import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Divider, Dropdown, Input, Row, Space, Tooltip } from 'antd';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { BigNumber } from '@ethersproject/bignumber';
import { networkToken } from '../lib';

import { constants } from '../config';
import {
  ChefInfo,
  DepositWithdrawAction,
  formatNumber,
  formatUnits,
  normalizePoolInfo,
  parseUnits,
  PoolInfo,
  PoolMeta,
  useBalances,
  useContract,
  useEthers,
  useLpApy,
  useSwmApy,
} from '../lib';
import { Loading, MetamaskConnect, PoolDepositWithdrawMenu } from '.';

interface Props {
  chefInfo: ChefInfo;
  pool: PoolMeta;
}

type Action = 'approve' | 'claim' | 'withdraw' | 'deposit';

const noErrorHandle = () => {};

export function Pool({ pool, chefInfo }: Props): ReactElement {
  const { address, networkId } = useEthers();
  const [ts, setTs] = useState<number>(Date.now());
  const [isApproved, setApproved] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [action, setAction] = useState<Action>();
  const [pendingReward, setPendingReward] = useState<BigNumber>();
  const [staked, setStaked] = useState<BigNumber>();
  const [stakedV1, setStakedV1] = useState<BigNumber>(BigNumber.from('0'));
  const [poolInfo, setPoolInfo] = useState<PoolInfo>();
  const [dwAction, setDwAction] = useState<DepositWithdrawAction>('deposit');
  const [amount, setAmount] = useState<string>('');
  const contracts = useContract();
  const balances = useBalances();
  const { chefV1, chef } = contracts;
  const token = contracts[pool.code];
  const lpApy = useLpApy('swmLp');
  const swmApy = useSwmApy();

  // user non-related stuff
  useEffect(() => {
    if (networkId && chef) {
      chef
        .poolInfo(pool.id)
        .then((pi) => {
          setPoolInfo(normalizePoolInfo(pi));
        })
        .catch(noErrorHandle);
    }
  }, [networkId, chef, pool.id, ts]);

  // user related stuff
  useEffect(() => {
    if (address && networkId && chef) {
      chef
        .pendingReward(pool.id, address)
        .then((x) => {
          setPendingReward(x);
        })
        .catch((err) => setPendingReward(BigNumber.from(0)));

      chef
        .userInfo(pool.id, address)
        .then((x) => {
          setStaked(x.amount);
        })
        .catch(noErrorHandle);
    }
  }, [address, networkId, chef, chefV1, pool.id, ts]);

  useEffect(() => {
    if (address && networkId && chef && chefV1) {
      chefV1
        .userInfo(pool.id, address)
        .then((x) => {
          setStakedV1(x.amount);
        })
        .catch(noErrorHandle);
    }
  });

  useEffect(() => {
    if (token && address) {
      token
        .allowance(address, chef.address)
        .then((allowance) => {
          // shoud probably explain this. Well, max allowance is so huge, that half is still huge. So we just assume
          // anyone who has over half has unlimited and no one can actually lower to half by normal transactions
          if (allowance.gt(constants.maxAllowance.div(2))) {
            setApproved(true);
          }
        })
        .catch(noErrorHandle);
    }
  }, [token, address, chef]);

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
      token
        .balanceOf(address)
        .then((amount) => setAmount(formatUnits(amount)))
        .catch(noErrorHandle);
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

  const handleWithdrawV1 = () => {
    setError(undefined);
    chefV1
      .emergencyWithdraw(pool.id)
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

  function formatStakedV1() {
    return stakedV1 ? formatNumber(formatUnits(stakedV1), 2) : 'N/A';
  }

  function formatBalance() {
    return balances && balances[pool.code] ? formatNumber(formatUnits(balances[pool.code].balance), 2) : 'N/A';
  }

  function dwButtonTitle() {
    if (dwAction === 'deposit') {
      return action === 'deposit' ? 'Depositing...' : 'Deposit';
    } else {
      return action === 'withdraw' ? 'Withdrawing...' : 'Withdraw';
    }
  }

  function apy(pid: number): ReactNode {
    let result;
    if (pid === 0) {
      result = swmApy;
    } else {
      result = lpApy;
    }
    return result ? formatNumber(result, 2) + '%' : <LoadingOutlined />;
  }

  const tokenSymbol = pool.tokenSymbol.replace('{networkToken}', networkToken[networkId]);

  return (
    <div className="pool">
      {poolInfo ? (
        <Card>
          <Row className="poolHeader">
            <Col span={24} sm={18} className="pool-header-left">
              <Space>
                <div className="pool-title">{pool.name.replace('{networkToken}', networkToken[networkId])}</div>
                {pool.id !== 0 && (
                  <a
                    className="pool-add-liquidity"
                    href={pool.poolLink[networkId]}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Add liquidity
                  </a>
                )}
              </Space>
            </Col>
            <Col span={24} sm={6} className="pool-header-right">
              {pool.allocPoint}× rewards
            </Col>
          </Row>
          <Divider />
          <Row className="pool-info">
            <Col span={24} sm={12}>
              <div className="pool-image">
                <img src={`/${pool.icon}`} alt="Token symbol" />
              </div>
            </Col>
            <Col span={24} sm={12}>
              <div>
                <div className="pool-apy">APY: {apy(pool.id)}</div>
                {pool.description && <p>{pool.description}</p>}
              </div>

              <div className="earned">
                <div className="earned-label">SWM Earned</div>
                {address ? (
                  <>
                    <div className="earned-amount">
                      {formatPendingReward()} <span className="unit">SWM</span>
                    </div>
                    <div className="earned-button">
                      <Button onClick={handleClaim} disabled={!pendingReward || pendingReward.eq(0)}>
                        {action === 'claim' ? 'Claiming...' : 'Claim'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="mt-2">
                    <MetamaskConnect />
                  </div>
                )}
              </div>
            </Col>
          </Row>
          {address && (
            <>
              <Divider />
              <Row>
                <Col>
                  <div className="stake">
                    {stakedV1.gt(0) ? (
                      <div className="mt-1">
                        <Tooltip
                          title={
                            <>
                              <p>
                                After identifying a bug in the staking contract, we fixed it and deployed an update.
                              </p>
                              <p>
                                Your pending rewards have been airdropped to your address by us, but you have to
                                withdraw the staked tokens manually from each pool you had a stake in
                              </p>
                            </>
                          }
                        >
                          <Button danger onClick={handleWithdrawV1}>
                            Withdraw {formatStakedV1()} {tokenSymbol} from old contract
                          </Button>
                        </Tooltip>
                      </div>
                    ) : (
                      <>
                        <h3 className="stake-title">Stake your {tokenSymbol} tokens to earn SWM rewards</h3>
                        <div className="stake-balance">
                          {isApproved ? (
                            <Space>
                              <span>
                                {tokenSymbol} available: {formatBalance()}
                              </span>
                              <span>Staked: {formatStaked()}</span>
                            </Space>
                          ) : (
                            <span>&nbsp;</span>
                          )}
                        </div>
                        <div className="stake-form">
                          {isApproved ? (
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
                          ) : (
                            <Button onClick={handleApprove}>
                              {action === 'approve' ? 'Approving...' : `Approve ${tokenSymbol}`}
                            </Button>
                          )}
                        </div>
                      </>
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
            </>
          )}
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  );
}
