import React from 'react';
import { Button, Space } from 'antd';
import { useEthers } from '../lib';
import { Address } from './Address';
import { NetworkSwitcher } from '.';

interface MetamaskConnectProps {
  label?: string;
}

export function MetamaskConnect({ label = 'Connect' }: MetamaskConnectProps) {
  const { connect, address, wrongNetwork } = useEthers();

  if (!connect) return null;

  const handleConnect = () => {
    if (address) {
      // already connected
      return;
    }
    connect(false);
  };

  if (address)
    return (
      <Space className="metamask-connected">
        <span>Connected to</span>
        <NetworkSwitcher />
        <Address shorter>{address}</Address>
      </Space>
    );

  if (wrongNetwork) {
    return (
      <Space className="metamask-connected danger">
        <span>Wrong network</span>
        <NetworkSwitcher />
      </Space>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      className="button-with-image"
      icon={<img src="/metamask-fox.svg" alt="Metamask icon" />}
    >
      {label}
    </Button>
  );
}
