import chefV1 from './MasterChefModV1.json';
import chef from './MasterChefMod.json';
import erc20 from './ERC20.json';
import uniPair from './UniswapV2Pair.json';
import { ContractType } from '../lib';

export const abis: Record<ContractType, any> = { chefV1, chef, erc20, uniPair };
