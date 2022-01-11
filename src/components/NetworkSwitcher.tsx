import React, { ReactElement } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { useEthers, getNetwork, ethereumNetworks } from '../lib';
import { DownOutlined } from '@ant-design/icons';

export function NetworkSwitcher(): ReactElement {
  const { browserNetworkId, changeNetwork } = useEthers();

  const menu = (
    <Menu>
      {Object.entries(ethereumNetworks).map(([chainId, chainName]) => (
        <Menu.Item key={chainId}>
          <Button type="link" onClick={() => changeNetwork(parseInt(chainId))}>
            {chainName}
          </Button>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown.Button overlay={menu} trigger={['click']} className="mx-2" icon={<DownOutlined />} size="small">
      {getNetwork(browserNetworkId) || 'Switch'}
    </Dropdown.Button>
  );
}
