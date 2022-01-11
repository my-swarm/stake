import React, { ReactElement, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { getNetwork, Network, ExternalProvider, Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { Signer } from '@ethersproject/abstract-signer';
import { ethProvider } from '../config';
import { Metamask, EthereumNetwork, ethereumNetworks } from '../lib';

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
  browserNetworkId: EthereumNetwork;
  networkId: EthereumNetwork;
  network: Network;
  connect: (silent: boolean) => void;
  connected: boolean;
  disconnect: () => void;
  contract: (name: string) => Contract;
  changeNetwork: (networkId: number) => void;
  wrongNetwork: boolean;
}

export const EthersContext = React.createContext<Partial<ContextProps>>({});

interface EthersProviderProps {
  children: ReactNode;
}

export function EthersProvider({ children }: EthersProviderProps): ReactElement {
  const [provider, setProvider] = useState<Web3Provider | JsonRpcProvider>(undefined);
  const [signer, setSigner] = useState<Signer>();
  const [browserNetworkId, setBrowserNetworkId] = useState<EthereumNetwork>();
  const [networkId, setNetworkId] = useState<EthereumNetwork>();
  const [status, setStatus] = useState<EthersStatus>(EthersStatus.DISCONNECTED);
  const [address, setAddress] = useState<string>();
  const [metamask, setMetamask] = useState<Metamask>();
  const ethereum = window['ethereum'];

  const allowedNetworks = Object.keys(ethereumNetworks);

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

  async function resetWeb3Provider(ethereum?: ExternalProvider) {
    // just to make sure ethereum really is passed. It should be.
    const fail = () => {
      setStatus(EthersStatus.FAILED);
      return false;
    };
    if (!ethereum) return fail();
    const _provider = new Web3Provider(ethereum, 'any');
    _provider.on('network', (newNetwork, oldNetwork) => {
      // does not really help
      // the problem is we are calling contrats while ethers is switching the networks
      // I solved it by catching aync errors and discarding them. Not ideal for sure.
      // if (oldNetwork) window.location.reload();
    });
    if (!_provider) return fail();

    const _networkId = (await _provider.getNetwork()).chainId;
    setBrowserNetworkId(_networkId);
    const isAllowedNetwork = allowedNetworks.indexOf(_networkId.toString()) !== -1;
    const accounts = await _provider.listAccounts();

    if (isAllowedNetwork && accounts && accounts.length > 0) {
      const _signer = _provider && _provider.getSigner();
      const _networkId = (await _signer.getChainId()) as EthereumNetwork;
      setProvider(_provider);
      setSigner(_signer);
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

  async function changeNetwork(networkId: number) {
    if (!metamask) return;
    metamask.changeNetwork(networkId);
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
        browserNetworkId,
        network: getNetwork(networkId),
        connect,
        changeNetwork,
        wrongNetwork: browserNetworkId && allowedNetworks.indexOf(browserNetworkId.toString()) === -1,
      }}
    >
      {children}
    </EthersContext.Provider>
  );
}

export const useEthers = () => useContext(EthersContext);
