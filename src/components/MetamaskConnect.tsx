import React from 'react';
import { Button } from 'antd';
import { useEthers } from '../lib';
import { Address } from './Address';

interface MetamaskConnectProps {
  label?: string;
}

export function MetamaskConnect({ label = 'Connect with Metamask' }: MetamaskConnectProps) {
  const { connect, address } = useEthers();

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
      <div className="metamask-connected">
        <span className="metamask-connected-connected">Connected: </span>
        <Address short>{address}</Address>
      </div>
    );

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
