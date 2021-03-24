import React, { ReactElement } from 'react';
import { Menu } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { DepositWithdrawAction } from '../lib';

interface Props {
  onChange: (action: DepositWithdrawAction) => void;
}

export function PoolDepositWithdrawMenu({ onChange }: Props): ReactElement {
  return (
    <Menu onClick={(e) => onChange(e.key as DepositWithdrawAction)}>
      <Menu.Item key="deposit" icon={<ArrowRightOutlined />}>
        Deposit
      </Menu.Item>
      <Menu.Item key="withdraw" icon={<ArrowLeftOutlined />}>
        Withdraw
      </Menu.Item>
    </Menu>
  );
}
