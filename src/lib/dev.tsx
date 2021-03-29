import { BigNumber } from '@ethersproject/bignumber';

export function dumpBn(bn: BigNumber) {
  console.log(bn.toString());
}

export function dumpBns(bns: Record<string, BigNumber>) {
  for (const [key, value] of Object.entries(bns)) {
    console.log(`${key}: ${value.toString()}`);
  }
}
