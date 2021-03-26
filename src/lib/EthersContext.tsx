import React, { ReactElement, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { getNetwork, Network, Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { Signer } from '@ethersproject/abstract-signer';
import { ethProvider } from '../config';
import { Metamask, EthereumNetwork } from '../lib';

export enum EthersStatus {
  DISCONNECTED,
  CONNECTED,
  FAILED,
}

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
  const [provider, setProvider] = useState<Web3Provider | JsonRpcProvider>(undefined);
  const [signer, setSigner] = useState<Signer>();
  const [networkId, setNetworkId] = useState<EthereumNetwork>();
  const [status, setStatus] = useState<EthersStatus>(EthersStatus.DISCONNECTED);
  const [address, setAddress] = useState<string>();
  const [metamask, setMetamask] = useState<Metamask>();
  const ethereum = window['ethereum'];

  useEffect(() => {
    if ((process as any).browser && ethereum) {
      const m = new Metamask(ethereum);
      setMetamask(m);
    } else {
      resetJsonRpcProvider();
    }
  }, [ethereum]);

  const connect = useCallback(
    async (silent: boolean): Promise<void> => {
      if (!metamask) return;
      metamask.onStateUpdate((e) => {
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
    const _provider = new Web3Provider(ethereum);

    setProvider(_provider);
    if (!_provider) {
      setStatus(EthersStatus.FAILED);
      return;
    }

    const accounts = await _provider.listAccounts();
    if (accounts && accounts.length > 0) {
      const _signer = _provider && _provider.getSigner();
      setSigner(_signer);
      const _networkId = (await _signer.getChainId()) as EthereumNetwork;
      setNetworkId(_networkId);
      setAddress(accounts[0].toLowerCase());
      setStatus(EthersStatus.CONNECTED);
    } else {
      setStatus(EthersStatus.DISCONNECTED);
      await resetJsonRpcProvider();
    }
  }

  async function resetJsonRpcProvider() {
    const url = `${ethProvider.url}`;
    const _provider = new JsonRpcProvider(url, ethProvider.chainId);
    if (!_provider) {
      setStatus(EthersStatus.FAILED);
      return;
    }

    setProvider(_provider);
    setNetworkId(ethProvider.chainId as EthereumNetwork);
    setAddress(undefined);
    setStatus(EthersStatus.CONNECTED);
  }

  // console.log({
  //   provider,
  //   signer,
  //   status,
  //   connected: status === EthersStatus.CONNECTED,
  //   address,
  //   networkId,
  //   network: getNetwork(networkId),
  //   connect,
  // });
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
