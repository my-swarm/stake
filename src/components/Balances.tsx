import React, { ReactElement, useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { Col, Row, Table } from 'antd';
import { useContract, ContractMap, useEthers, formatUnits, formatNumber } from '../lib';

interface Record {
  key: number;
  token: ReactElement;
  balance: BigNumber;
}

export function Balances(): ReactElement {
  const [data, setData] = useState<Record[]>([]);
  const contracts = useContract();
  const { address, networkId } = useEthers();

  useEffect(() => {
    if (contracts && address) {
      loadBalances(contracts, address);
    }
  }, [contracts, address, networkId]);

  const loadBalances = async (contracts: ContractMap, address: string) => {
    let result = [];
    let key = 0;
    for (const contract of Object.values(contracts)) {
      try {
        const tokenSymbol = await contract.symbol();
        const tokenName = await contract.name();
        const balance = formatNumber(formatUnits(await contract.balanceOf(address)), 4);
        result.push({
          token: (
            <>
              <strong>{tokenSymbol}</strong> {tokenName}
            </>
          ),
          balance,
          key: ++key,
        });
      } catch (e) {
        // don't count
      }
    }
    setData(result);
  };
  const columns = [
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right' as any,
    },
  ];

  return (
    <Row className="mb-4">
      <Col span={24} lg={{ span: 20, offset: 2 }} xl={{ span: 16, offset: 4 }}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Col>
    </Row>
  );
}
