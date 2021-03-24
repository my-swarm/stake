import React, { ReactElement, ReactNode } from 'react';

import { EthereumNetwork, etherscanDomains, useEthers } from '../lib';

interface AddressProps {
  children: ReactNode;
  link?: boolean;
  short?: boolean;
  shorter?: boolean;
}

function getEtherscanUrl(networkId: EthereumNetwork, address: string) {
  return `https://${etherscanDomains[networkId]}/address/${address}`;
}

export function Address({ children, link = false, short = false, shorter = false }: AddressProps): ReactElement {
  const { networkId } = useEthers();

  if (typeof children !== 'string') {
    return <>{children}</>;
  }

  if (link && !networkId) {
    throw new Error('Need to provide networkId to display as a link');
  }

  let result;

  if (short || shorter) {
    const len = short ? 6 : 4;
    result = (
      <span className="c-address" title={children}>
        <span>{children.substr(0, len + 2)}</span>
        <span>…</span>
        <span>{children.substr(-len)}</span>
      </span>
    );
  } else {
    const chunks = children.match(/.{1,8}/g) || [];
    result = (
      <span className="c-address">
        {chunks.map((part, key) => (
          <span key={key}>{part}</span>
        ))}
      </span>
    );
  }

  if (link && networkId) {
    result = (
      <a href={getEtherscanUrl(networkId, children)} target="_blank" rel="noreferrer noopener">
        {result}
      </a>
    );
  }

  return <>{result}</>;
}
