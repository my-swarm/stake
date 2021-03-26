import chef from './MasterChefMod.json';
import erc20 from './ERC20.json';
import uniPair from './UniswapV2Pair.json';
import { ContractType } from '../lib';

export const abis: Record<ContractType, any> = { chef, erc20, uniPair };
