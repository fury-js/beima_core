const unlockedAccount = "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8"
const fromUnlockedAccount = {
  from: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8",
  gasLimit: web3.utils.toHex(500000),
  gasPrice: web3.utils.toHex(20000000000) // use ethgasstation.info (mainnet only)
};

const account = "0xd037f8DBd4749ffb3Df62316049c66061B36a6B2"
const binanceAccount = '0xe2fc31F816A9b94326492132018C3aEcC4a93aE1';
const fromUnlockedBinanceAccount = {
	from: '0xe2fc31F816A9b94326492132018C3aEcC4a93aE1',
	gasLimit: web3.utils.toHex(500000),
	gasPrice: web3.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
};

const xendOnEthereum = '0xE4CFE9eAa8Cdb0942A80B7bC68fD8Ab0F6D44903';

const xendOnBsc = '0x4a080377f83d669d7bb83b3184a8a5e61b500608';

const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
const ether = (n) => {
	return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))
}
const tokens = (n) => ether(n)

const wait = (seconds) => {
	const milliseconds = seconds * 1000
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}