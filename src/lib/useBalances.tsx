import React, { ReactElement, useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { ContractMap, useContract } from './useContract';
import { useEthers } from './EthersContext';
import { formatNumber, formatUnits } from './numbers';

export interface BalanceRecord {
  key: string;
  token: ReactElement;
  balance: BigNumber;
  balanceStr: string;
}

export type Balances = Record<string, BalanceRecord>;

export function useBalances() {
  const [balances, setBalances] = useState<Balances>({});
  const contracts = useContract();
  const { address, networkId } = useEthers();

  useEffect(() => {
    if (contracts && address) {
      loadBalances(contracts, address);
    }
  }, [contracts, address, networkId]);

  const loadBalances = async (contracts: ContractMap, address: string) => {
    let result: Balances = {};
    for (const [key, contract] of Object.entries(contracts)) {
      try {
        const tokenSymbol = await contract.symbol();
        const tokenName = await contract.name();
        const balance = await contract.balanceOf(address);
        result[key] = {
          key,
          token: (
            <>
              <strong>{tokenSymbol}</strong> {tokenName}
            </>
          ),
          balance,
          balanceStr: formatNumber(formatUnits(await contract.balanceOf(address)), 4),
        };
      } catch (e) {
        // don't count
      }
    }
    setBalances(result);
  };

  return balances;
}
