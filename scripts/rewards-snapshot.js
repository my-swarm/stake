const fs = require('fs');
const { ethers } = require('ethers');
const { BigNumber } = ethers;
const abi = require('../src/abi/MasterChefMod.json');

const provider = new ethers.providers.JsonRpcProvider(
  'https://eth-mainnet.alchemyapi.io/v2/7fSoOXhLHTn6DGVq4qUjYlU9F-UlRyPr',
);
const contract = new ethers.Contract('0xD38abbAeC03a9FF287eFc9a5F0d0580E07335D1D', abi, provider);

async function run() {
  const poolInfo0 = await contract.poolInfo(0);
  const poolInfo1 = await contract.poolInfo(1);
  const rewardPerShare0 = poolInfo0.accRewardPerShare;
  const rewardPerShare1 = poolInfo1.accRewardPerShare;
  const precision = BigNumber.from(10).pow(18);

  const events = await contract.queryFilter('Deposit', 12107696);
  let addresses = [...new Set(events.map((event) => event.args.user))];

  const records = (
    await Promise.all(
      addresses.map(async (address) => {
        const userInfo0 = await contract.userInfo(0, address);
        const userInfo1 = await contract.userInfo(1, address);
        const balancePool0 = userInfo0.amount.mul(rewardPerShare0).div(precision).sub(userInfo0.rewardDebt);
        const balancePool1 = userInfo1.amount.mul(rewardPerShare1).div(precision).sub(userInfo1.rewardDebt);
        const balance = balancePool0.add(balancePool1);
        const result = {
          address,
          balance0: balancePool0.toString(),
          balance1: balancePool1.toString(),
          balance: balance.toString(),
        };
        return result;
      }),
    )
  ).filter((row) => row.balance !== '0');

  const sum0 = records.map((record) => record.balance0).reduce((sum, curr) => sum.add(curr), BigNumber.from(0));
  const sum1 = records.map((record) => record.balance1).reduce((sum, curr) => sum.add(curr), BigNumber.from(0));
  const sum = sum0.add(sum1);
  console.log({ sum0, sum1, sum });

  const data =
    'Address,balance_pool0,balance_pool1,balance_total\n' +
    records.map((row) => `${row.address},${row.balance0},${row.balance1},${row.balance}`).join('\n') +
    `\nTotal,${sum0},${sum1},${sum}`;
  fs.writeFileSync('snapshot.csv', data);
}

run()
  .then(() => console.log('all done'))
  .catch((e) => console.error(e));
