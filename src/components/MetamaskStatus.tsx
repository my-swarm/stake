import React from 'react';
import { Button, Tooltip } from 'antd';
import { getNetwork } from '../lib';

import { EthereumNetwork, EthersStatus, useEthers } from '../lib';
import { Address } from '.';

export function MetamaskStatus() {
  const { status, connect, address, networkId } = useEthers();

  const supportedNetworks = [EthereumNetwork.Main, EthereumNetwork.Xdai];

  let cardTitle, cardBody;
  switch (networkId && status) {
    case EthersStatus.DISCONNECTED:
      cardTitle = 'Disconnected';
      cardBody = (
        <div className="body">
          <Button size="small" onClick={() => connect && connect(false)} className="link">
            connect
          </Button>
        </div>
      );
      break;
    case EthersStatus.CONNECTED:
      cardTitle = 'Connected';

      cardBody = (
        <div className="body">
          <div className="mb-1">{address ? <Address>{address}</Address> : 'unknown address'}</div>
          <div>
            network:{' '}
            {supportedNetworks.indexOf(networkId!) === -1 && <Tooltip title={`Unsupported network`}>❗</Tooltip>}{' '}
            <strong>{getNetwork(networkId!)}</strong>
          </div>
        </div>
      );
      break;
    case EthersStatus.FAILED:
      cardTitle = 'Failed';
      cardBody = 'Failed to connect. Make sure you have Metamask installed';
      break;
  }

  return (
    <>
      <h3 className="title">
        <img src="/metamask-fox.svg" alt="Metamask icon" className="icon" /> {cardTitle}
      </h3>
      <div>{cardBody}</div>
    </>
  );
}
