import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { formatUnits as _formatUnits, parseUnits as _parseUnits } from '@ethersproject/units';

export function formatUnits(bnAmount: BigNumberish, decimals: number = 18, ifZero = '0'): string {
  bnAmount = BigNumber.from(bnAmount || 0);
  if (bnAmount.eq(0)) return ifZero;
  return _formatUnits(bnAmount, decimals);
}

export function getUnitsAsNumber(bnAmount: BigNumberish, decimals: number): number {
  bnAmount = BigNumber.from(bnAmount || 0);
  if (bnAmount.eq(0)) return 0;
  return parseFloat(_formatUnits(bnAmount, decimals));
}

export function formatNumber(n: number | string, decimals = 0): string {
  if (typeof n === 'string') {
    n = parseFloat(n);
  }
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}

export function parseUnits(amount: string | number, decimals: number = 18): BigNumber {
  if (!amount) return BigNumber.from(0);
  if (typeof amount === 'number') amount = amount.toString();
  return _parseUnits(amount, decimals);
}
