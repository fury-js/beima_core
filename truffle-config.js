
const dotenv = require('dotenv');
dotenv.config();

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
	// plugins: ['truffle-plugin-verify'],
	// api_keys: {
	// 	bscscan: process.env.BSCSCANAPIKEY,
	// },

	networks: {
		development: {
			host: '127.0.0.1', // Localhost (default: none)
			port: 8545, // Standard Ethereum port (default: none)
			network_id: '*', // Any network (default: none)
			networkCheckTimeout: 1000000,
			timeoutBlocks: 200,
		},
		// kovan: {
		// 	provider: () => {
		// 		return new HDWalletProvider(
		// 			process.env.MNEMONIC,
		// 			process.env.INFURA_WEBSOCKET,
		// 		);
		// 	},
		// 	network_id: 42,
		// 	networkCheckTimeout: 1000000,
		// 	timeoutBlocks: 200,
		// },

		// testnet: {
		// 	provider: () =>
		// 		new HDWalletProvider(
		// 			process.env.MNEMONIC,
		// 			'https://data-seed-prebsc-2-s2.binance.org:8545',
		// 		),
		// 	network_id: 97,
		// 	confirmations: 2,
		// 	networkCheckTimeout: 5000000,
		// 	timeoutBlocks: 200,
		// 	skipDryRun: true,
		// 	gas: 6000000,
		// 	gasPrice: 20000000000,
		// },

		// rinkeby: {
		// 	provider: new HDWalletProvider(
		// 		process.env.MNEMONIC,
		// 		process.env.INFURA_API_RINKEBY,
		// 	),
		// 	network_id: 4,
		// 	networkCheckTimeout: 2000000,
		// 	timeoutBlocks: 200,
		// 	gas: 4500000,
		// 	gasPrice: 10000000000,
		// },
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		// timeout: 100000
	},

	// Configure your compilers
	compilers: {
		solc: {
			version: '0.8.0', // Fetch exact version from solc-bin (default: truffle's version)
			// docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
			// settings: {
			// 	// See the solidity docs for advice about optimization and evmVersion
			// 	// optimizer: {
			// 	// 	enabled: false,
			// 	// 	runs: 200,
			// 	// },
			// 	//  evmVersion: "byzantium"
			// },
		},
	},

	// db: {
	// 	enabled: false,
	// },
};
