import { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { ContractName, useEthers } from '.';
import { abis } from '../abi';
import { contractAddresses, contractTypes } from '../config';

export type ContractMap = { [key: string]: Contract };

export function useContract(): ContractMap {
  const [contracts, setContracts] = useState<ContractMap>({});
  const { provider, signer, networkId } = useEthers();
  const signerOrProvider = signer || provider;
  useEffect(() => {
    if (signerOrProvider && networkId) {
      const result: ContractMap = {};
      for (const [name, type] of Object.entries(contractTypes)) {
        const abi = abis[type];
        const address = contractAddresses[networkId][name as ContractName];
        result[name] = new Contract(address, abi, signerOrProvider);
      }
      setContracts(result);
    }
  }, [provider, signer, networkId]);
  return contracts;
}
