import React, { ReactElement } from 'react';
import { Col, Row, Table } from 'antd';
import { useBalances } from '../lib/useBalances';

export function Balances(): ReactElement {
  const data = useBalances();

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
