import { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { ContractName, useEthers } from '.';
import { abis } from '../abi';
import { contractAddresses, contractTypes } from '../config';

export type ContractMap = { [key: string]: Contract };

export function useContract(): ContractMap {
  const [contracts, setContracts] = useState<ContractMap>({});
  const { signer, networkId } = useEthers();
  useEffect(() => {
    if (signer && networkId) {
      const result: ContractMap = {};
      for (const [name, type] of Object.entries(contractTypes)) {
        const abi = abis[type];
        const address = contractAddresses[networkId][name as ContractName];
        result[name] = new Contract(address, abi, signer);
      }
      setContracts(result);
    }
  }, [signer, networkId]);
  return contracts;
}
