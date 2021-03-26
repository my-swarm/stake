import React, { ReactElement, useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { ContractMap, useContract } from './useContract';
import { useEthers } from './EthersContext';
import { formatNumber, formatUnits } from './numbers';

interface Record {
  key: number;
  token: ReactElement;
  balance: BigNumber;
}

export function useBalances() {
  const [balances, setBalances] = useState<Record[]>([]);
  const contracts = useContract();
  const { address, networkId } = useEthers();

  useEffect(() => {
    if (contracts && address) {
      loadBalances(contracts, address);
    }
  }, [contracts, address, networkId]);

  const loadBalances = async (contracts: ContractMap, address: string) => {
    let result = [];
    let key = 0;
    for (const contract of Object.values(contracts)) {
      try {
        const tokenSymbol = await contract.symbol();
        const tokenName = await contract.name();
        const balance = formatNumber(formatUnits(await contract.balanceOf(address)), 4);
        result.push({
          token: (
            <>
              <strong>{tokenSymbol}</strong> {tokenName}
            </>
          ),
          balance,
          key: ++key,
        });
      } catch (e) {
        // don't count
      }
    }
    setBalances(result);
  };

  return balances;
}
