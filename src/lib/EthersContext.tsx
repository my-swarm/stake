import React, { ReactElement, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { getNetwork, Network, Web3Provider, JsonRpcProvider, ExternalProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { Signer } from '@ethersproject/abstract-signer';
import { Metamask, EthereumNetwork } from '.';

export enum EthersStatus {
  DISCONNECTED,
  CONNECTED,
  FAILED,
}

export const devEthereumNode = {
  address: 'http://127.0.0.1:8545',
  networkId: 31337,
};

interface ContextProps {
  status: EthersStatus;
  provider?: Web3Provider | JsonRpcProvider;
  signer?: Signer;
  address?: string;
  networkId: EthereumNetwork;
  network: Network;
  connect: (silent: boolean) => void;
  connected: boolean;
  disconnect: () => void;
  contract: (name: string) => Contract;
}

export const EthersContext = React.createContext<Partial<ContextProps>>({});

interface EthersProviderProps {
  children: ReactNode;
}

export function EthersProvider({ children }: EthersProviderProps): ReactElement {
  const [provider, setProvider] = useState<Web3Provider | undefined>();
  const [signer, setSigner] = useState<Signer>();
  const [networkId, setNetworkId] = useState<EthereumNetwork>(1);
  const [status, setStatus] = useState<EthersStatus>(EthersStatus.DISCONNECTED);
  const [address, setAddress] = useState<string>();
  const [metamask, setMetamask] = useState<Metamask>();

  useEffect(() => {
    // @ts-ignore
    const ethereum = window && window.ethereum;
    if (ethereum) {
      const m = new Metamask(ethereum);
      setMetamask(m);
    } else {
      throw new Error('Could not figure out how to setup ethereum provider');
    }
  }, []);

  const connect = useCallback(
    async (silent: boolean): Promise<void> => {
      if (!metamask) return;
      metamask.onStateUpdate((e) => {
        console.log('metemask state update', e);
        resetWeb3Provider(e);
      });
      await metamask.initAndConnect(silent);
    },
    [metamask],
  );

  useEffect(() => {
    if (metamask) {
      connect(true).then();
    }
  }, [metamask, connect]);

  async function resetWeb3Provider(ethereum = undefined) {
    if (!ethereum) {
      setStatus(EthersStatus.FAILED);
      return;
    }
    const _provider = new Web3Provider((ethereum as unknown) as ExternalProvider);
    const _signer = _provider && _provider.getSigner();

    setProvider(_provider);
    setSigner(_signer);
    if (!_provider) {
      setStatus(EthersStatus.FAILED);
      return;
    }

    const _networkId = (await _signer.getChainId()) as EthereumNetwork;
    setNetworkId(_networkId);
    const accounts = await _provider.listAccounts();
    if (accounts && accounts.length > 0) {
      setAddress(accounts[0].toLowerCase());
      setStatus(EthersStatus.CONNECTED);
    } else {
      setAddress(undefined);
      setStatus(EthersStatus.DISCONNECTED);
    }
  }

  return (
    <EthersContext.Provider
      value={{
        provider,
        signer,
        status,
        connected: status === EthersStatus.CONNECTED,
        address,
        networkId,
        network: getNetwork(networkId),
        connect,
      }}
    >
      {children}
    </EthersContext.Provider>
  );
}

export const useEthers = () => useContext(EthersContext);
