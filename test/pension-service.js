/** @format */

// const web3 = require("web3")

let BN = web3.utils.BN;
const EVM_REVERT = 'VM Exception while processing transaction: revert';
const USDC_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

const USDC_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'authorizer',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'nonce',
				type: 'bytes32',
			},
		],
		name: 'AuthorizationCanceled',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'authorizer',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'nonce',
				type: 'bytes32',
			},
		],
		name: 'AuthorizationUsed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: '_account',
				type: 'address',
			},
		],
		name: 'Blacklisted',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'newBlacklister',
				type: 'address',
			},
		],
		name: 'BlacklisterChanged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'burner',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'Burn',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'newMasterMinter',
				type: 'address',
			},
		],
		name: 'MasterMinterChanged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'minter',
				type: 'address',
			},
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'Mint',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'minter',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'minterAllowedAmount',
				type: 'uint256',
			},
		],
		name: 'MinterConfigured',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'oldMinter',
				type: 'address',
			},
		],
		name: 'MinterRemoved',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{ anonymous: false, inputs: [], name: 'Pause', type: 'event' },
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'newAddress',
				type: 'address',
			},
		],
		name: 'PauserChanged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'newRescuer',
				type: 'address',
			},
		],
		name: 'RescuerChanged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: '_account',
				type: 'address',
			},
		],
		name: 'UnBlacklisted',
		type: 'event',
	},
	{ anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
	{
		inputs: [],
		name: 'CANCEL_AUTHORIZATION_TYPEHASH',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'DOMAIN_SEPARATOR',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'PERMIT_TYPEHASH',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'RECEIVE_WITH_AUTHORIZATION_TYPEHASH',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'TRANSFER_WITH_AUTHORIZATION_TYPEHASH',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'spender', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'authorizer', type: 'address' },
			{ internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
		],
		name: 'authorizationState',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
		name: 'blacklist',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'blacklister',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
		name: 'burn',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'authorizer', type: 'address' },
			{ internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
			{ internalType: 'uint8', name: 'v', type: 'uint8' },
			{ internalType: 'bytes32', name: 'r', type: 'bytes32' },
			{ internalType: 'bytes32', name: 's', type: 'bytes32' },
		],
		name: 'cancelAuthorization',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'minter', type: 'address' },
			{ internalType: 'uint256', name: 'minterAllowedAmount', type: 'uint256' },
		],
		name: 'configureMinter',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'currency',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'decrement', type: 'uint256' },
		],
		name: 'decreaseAllowance',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'increment', type: 'uint256' },
		],
		name: 'increaseAllowance',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'string', name: 'tokenName', type: 'string' },
			{ internalType: 'string', name: 'tokenSymbol', type: 'string' },
			{ internalType: 'string', name: 'tokenCurrency', type: 'string' },
			{ internalType: 'uint8', name: 'tokenDecimals', type: 'uint8' },
			{ internalType: 'address', name: 'newMasterMinter', type: 'address' },
			{ internalType: 'address', name: 'newPauser', type: 'address' },
			{ internalType: 'address', name: 'newBlacklister', type: 'address' },
			{ internalType: 'address', name: 'newOwner', type: 'address' },
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'string', name: 'newName', type: 'string' }],
		name: 'initializeV2',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'lostAndFound', type: 'address' },
		],
		name: 'initializeV2_1',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
		name: 'isBlacklisted',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
		name: 'isMinter',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'masterMinter',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: '_to', type: 'address' },
			{ internalType: 'uint256', name: '_amount', type: 'uint256' },
		],
		name: 'mint',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'minter', type: 'address' }],
		name: 'minterAllowance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
		name: 'nonces',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'pause',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'paused',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'pauser',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
			{ internalType: 'uint256', name: 'deadline', type: 'uint256' },
			{ internalType: 'uint8', name: 'v', type: 'uint8' },
			{ internalType: 'bytes32', name: 'r', type: 'bytes32' },
			{ internalType: 'bytes32', name: 's', type: 'bytes32' },
		],
		name: 'permit',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
			{ internalType: 'uint256', name: 'validAfter', type: 'uint256' },
			{ internalType: 'uint256', name: 'validBefore', type: 'uint256' },
			{ internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
			{ internalType: 'uint8', name: 'v', type: 'uint8' },
			{ internalType: 'bytes32', name: 'r', type: 'bytes32' },
			{ internalType: 'bytes32', name: 's', type: 'bytes32' },
		],
		name: 'receiveWithAuthorization',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'minter', type: 'address' }],
		name: 'removeMinter',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'contract IERC20',
				name: 'tokenContract',
				type: 'address',
			},
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'rescueERC20',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'rescuer',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
			{ internalType: 'uint256', name: 'validAfter', type: 'uint256' },
			{ internalType: 'uint256', name: 'validBefore', type: 'uint256' },
			{ internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
			{ internalType: 'uint8', name: 'v', type: 'uint8' },
			{ internalType: 'bytes32', name: 'r', type: 'bytes32' },
			{ internalType: 'bytes32', name: 's', type: 'bytes32' },
		],
		name: 'transferWithAuthorization',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
		name: 'unBlacklist',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'unpause',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: '_newBlacklister', type: 'address' },
		],
		name: 'updateBlacklister',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: '_newMasterMinter', type: 'address' },
		],
		name: 'updateMasterMinter',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '_newPauser', type: 'address' }],
		name: 'updatePauser',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'newRescuer', type: 'address' }],
		name: 'updateRescuer',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'version',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
];
const ATOKEN_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"BalanceTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"underlyingAsset","type":"address"},{"indexed":true,"internalType":"address","name":"pool","type":"address"},{"indexed":false,"internalType":"address","name":"treasury","type":"address"},{"indexed":false,"internalType":"address","name":"incentivesController","type":"address"},{"indexed":false,"internalType":"uint8","name":"aTokenDecimals","type":"uint8"},{"indexed":false,"internalType":"string","name":"aTokenName","type":"string"},{"indexed":false,"internalType":"string","name":"aTokenSymbol","type":"string"},{"indexed":false,"internalType":"bytes","name":"params","type":"bytes"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"ATOKEN_REVISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EIP712_REVISION","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"POOL","outputs":[{"internalType":"contract ILendingPool","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"RESERVE_TREASURY_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"UNDERLYING_ASSET_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"receiverOfUnderlying","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getIncentivesController","outputs":[{"internalType":"contract IAaveIncentivesController","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getScaledUserBalanceAndSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"handleRepayment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ILendingPool","name":"pool","type":"address"},{"internalType":"address","name":"treasury","type":"address"},{"internalType":"address","name":"underlyingAsset","type":"address"},{"internalType":"contract IAaveIncentivesController","name":"incentivesController","type":"address"},{"internalType":"uint8","name":"aTokenDecimals","type":"uint8"},{"internalType":"string","name":"aTokenName","type":"string"},{"internalType":"string","name":"aTokenSymbol","type":"string"},{"internalType":"bytes","name":"params","type":"bytes"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"mintToTreasury","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"scaledBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"scaledTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferOnLiquidation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferUnderlyingTo","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]
const { assert } = require('chai');
require('chai').use(require('chai-as-promised')).should();

const PensionServiceProvider = artifacts.require('Beima');
const BUSD = artifacts.require('mBUSD');
// const Keeper = artifacts.require("MockKeeper")

contract('Pension Service Provider', ([owner, applicant]) => {
	let balanceBefore;
	let balanceAfter;
	let result;
	let upkeepInterval = 1;
	let userDetails = 'chukky';
	// let= "chukky";
	let pensionPlanDetails = 'Flexible';
	let amountToSpend = 10;
	let amountToSpend1 = web3.utils.toWei('175', 'ether');
	let amountToSpend2 = web3.utils.toWei('30', 'ether');
	let amountToSpend3 = web3.utils.toWei('50', 'ether');  // 1 usdc tokens
	let approvedAmountToSpend = 1000; // 10 link tokens
	// let amountToSpend = 10000;
	// let approvedAmountToSpend = 100000000;
	let lockTime = 30;
	let timeDuration = 1;
	// const link = new web3.eth.Contract(LINK_ABI, LINK_ADDRESS);

	const unlockedAccount = '0xfa0b641678F5115ad8a8De5752016bD1359681b9';
	// const unlockedAccount = '0xd037f8DBd4749ffb3Df62316049c66061B36a6B2';

	const xendOnEthereum = '0xE4CFE9eAa8Cdb0942A80B7bC68fD8Ab0F6D44903';
	// const cUSDC = '0xface851a4921ce59e912d19329929ce6da6eb0c7';
	const cUSDC = '0x4a92E71227D294F041BD82dd8f78591B75140d63';
	const cLinkMainet = '0xface851a4921ce59e912d19329929ce6da6eb0c7';

	// const comptrollerAddressMainnet = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B"
	// const priceOracleAddressMainnet = "0x02557a5e05defeffd4cae6d83ea3d173b272c904"

	// const priceOracleAddressKovan = "0x37ac0cb24b5DA520B653A5D94cFF26EB08d4Dc02"
	const cEth = '0x41B5844f4680a8C38fBb695b7F9CFd1F64474a72';
	const xend = '0xE4CFE9eAa8Cdb0942A80B7bC68fD8Ab0F6D44903';
	const lendingPoolAddress = '0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf';

	// const upkeepInterval = 30;

	// const accounts = await web3.eth.getAccounts();
	// const account = accounts[0];

	const fromUnlockedAccount = {
		from: unlockedAccount,
		gasLimit: web3.utils.toHex(500000),
		gasPrice: web3.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
	};
	let pensionContract;
	let busd;
	let usdc;

	beforeEach(async () => {
		// load contracts
		pensionContract = await PensionServiceProvider.new(
			lendingPoolAddress,
			upkeepInterval,
		);
		// console.log('Beima deployed:', pensionContract.address);

		busd = await BUSD.new();
		// console.log('Mock Busd deployed:', busd.address);
		await pensionContract.startPool(1, 0);
		await pensionContract.initializePool(0, 10);
		usdc = new web3.eth.Contract(USDC_ABI, USDC_ADDRESS);
		await busd.transfer(applicant, approvedAmountToSpend )
	});
	describe('Beima Pensions Tests', () => {
		it("Register's Applicants", async () => {
			// register a company
			let resut = await pensionContract.register(userDetails);
			// console.log(result.logs[0].args);
		});

		it('Accepts Deposits and Invests', async () => {
			await pensionContract.register(userDetails, { from: unlockedAccount });
			await pensionContract.setPlan(
				USDC_ADDRESS,
				pensionPlanDetails,
				approvedAmountToSpend,
				amountToSpend,
				timeDuration,
				lockTime,
				{ from: unlockedAccount },
			);
			
			await usdc.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);
			let balance = await usdc.methods.balanceOf(unlockedAccount).call()
			console.log(balance.toString())

			await pensionContract.depositToken(0, USDC_ADDRESS, amountToSpend,  {from: unlockedAccount});
			await pensionContract.depositToken(0, USDC_ADDRESS, amountToSpend, {
				from: unlockedAccount,
			});
			
			await pensionContract.supply(fromUnlockedAccount);
		})
			

		it("Updates User deposited amount and Reduces User Approved amount", async () => {
		    await pensionContract.register(userDetails, { from: unlockedAccount });
			await pensionContract.setPlan(
				USDC_ADDRESS,
				pensionPlanDetails,
				approvedAmountToSpend,
				amountToSpend,
				timeDuration,
				lockTime,
				{ from: unlockedAccount },
			);
		    await usdc.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);
		    let deposit = await pensionContract.depositToken(0, USDC_ADDRESS, amountToSpend,  {from: unlockedAccount});

			console.log("Deposited Amount in USDC:", deposit.logs[0].args.amountSpent.toString());

		    result = await pensionContract.assets( USDC_ADDRESS, unlockedAccount, fromUnlockedAccount);;
		    // console.log(result.toString())
		    let user = await pensionContract.pensionServiceApplicant(unlockedAccount);
		    assert.equal(Number(new BN(approvedAmountToSpend).sub(new BN(amountToSpend))), Number(new BN(user.client.approvedAmountToSpend)), "Approved Amount Reduced after Deposit")

		    // console.log("Deposited Amount:", web3.utils.fromWei(result.client.depositedAmount.toString(), "ether"))
		    // console.log("Remaing Approved Amount set by User:", web3.utils.fromWei(result.client.approvedAmountToSpend.toString(), "ether"))
		    // console.log("Deafult amount to deposit on intervals:", web3.utils.fromWei(result.client.amountToSpend.toString(), "ether"))
		    // console.log(`Increased deposited amount by ${web3.utils.fromWei(amountToSpend.toString(), "ether")}. Deposited Amount currently at:`, web3.utils.fromWei(result.client.depositedAmount.toString(), "ether"))
		    // console.log(`Reduced approved Amount to Spend by Contract by ${web3.utils.fromWei(amountToSpend.toString(), "ether")}. Approved Amount to Spend currently at: `, web3.utils.fromWei(result.client.approvedAmountToSpend.toString(), "ether"))
		    // console.log("Default amount to spend set by User on Registeration:", web3.utils.fromWei(reslt.client.amountToSpend.toString(), "ether"))
		})

		it("Gets User Accrued Interest PerBlock", async () => {
		    let interest;
		   await pensionContract.register(userDetails, { from: unlockedAccount });
			await pensionContract.setPlan(
				USDC_ADDRESS,
				pensionPlanDetails,
				approvedAmountToSpend,
				amountToSpend,
				timeDuration,
				lockTime,
				{ from: unlockedAccount },
			);
		    await usdc.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);
		    await pensionContract.depositToken(0, USDC_ADDRESS, amountToSpend,  {from: unlockedAccount});

		    await pensionContract.depositToken(0, USDC_ADDRESS, amountToSpend,  {from: unlockedAccount});
		    let user = await pensionContract.pensionServiceApplicant(unlockedAccount);
		    // let assetAddress = await pensionContract.getAssetAddress(user.client.underlyingAsset)

		    interest = await pensionContract.pendingRewards(0, fromUnlockedAccount)
		    console.log("Accrued Interest per block based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

		    await pensionContract.depositToken(0, USDC_ADDRESS, amountToSpend,  {from: unlockedAccount});

		    interest = await pensionContract.pendingRewards(0, fromUnlockedAccount)
		    console.log("Accrued Interest per block based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

		    await pensionContract.depositToken(0, USDC_ADDRESS, amountToSpend,  {from: unlockedAccount});

		    interest = await pensionContract.pendingRewards(0, fromUnlockedAccount)
		    console.log("Accrued Interest per block based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

		    interest = await pensionContract.pendingRewards(0, fromUnlockedAccount)
		    console.log("Accrued Interest per block based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

		    await pensionContract.supply(fromUnlockedAccount)

		})

		it("Get's the contract's A Token Balance data from aave protocol", async () => {
			await pensionContract.register(userDetails, { from: unlockedAccount });
			await pensionContract.setPlan(
				USDC_ADDRESS,
				pensionPlanDetails,
				approvedAmountToSpend,
				amountToSpend,
				timeDuration,
				lockTime,
				{ from: unlockedAccount },
			);

			await usdc.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);

			await pensionContract.depositToken(0, USDC_ADDRESS, amountToSpend,  {from: unlockedAccount});
			await pensionContract.depositToken(0, USDC_ADDRESS, amountToSpend,  {from: unlockedAccount});
			await pensionContract.depositToken(0, USDC_ADDRESS, amountToSpend,  {from: unlockedAccount});
			await pensionContract.supply(fromUnlockedAccount)

			let data = await pensionContract.getAssetAtokenAddress( fromUnlockedAccount)
			
			let ATOKEN_ADDRESS = data.aTokenAddress;
	
			let aToken = new web3.eth.Contract(ATOKEN_ABI, ATOKEN_ADDRESS);
			let contractAtokenBalance = await aToken.methods.balanceOf(pensionContract.address).call()
			console.log("Contract A Token Balance After supply:", contractAtokenBalance.toString())
		})

		// it("Wthdraws Underlying Assets and Credits the Owner of the Assets", async () => {
		//     await pensionContract.register(userDetails, {from: unlockedAccount });
		//     await pensionContract.setPlan(cLinkMainet, pensionPlanDetails, approvedAmountToSpend, amountToSpend, timeDuration, lockTime, { from: unlockedAccount })

		//     await link.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);

		//     await pensionContract.depositToken(0, USDC_ADDRESS, amountToSpend,  {from: unlockedAccount});

		//     await wait(2)
		//     // 2nd transaction
		//     await pensionContract.depositToken(LINK_ADDRESS, amountToSpend, fromUnlockedAccount)
		//     let UserAssetamount = await pensionContract.assets( LINK_ADDRESS, unlockedAccount, fromUnlockedAccount);
		//     let user = await pensionContract.pensionServiceApplicant(unlockedAccount);

		//     await pensionContract.supply(user.client.underlyingAsset, fromUnlockedAccount)

		//     userAmount = web3.utils.fromWei(UserAssetamount.toString(), "ether")
		//     console.log(userAmount)
		//     console.log("cAsset to withdraw", user.client.underlyingAsset)

		//     // check balance before withdrawal
		//     let balanceBeforeWithdraw = await link.methods.balanceOf(unlockedAccount).call();
		//     balanceBeforeWithdrawal = web3.utils.fromWei(balanceBeforeWithdraw.toString(), "ether")
		//     console.log("User Balance Before Withdrawal:",Number(balanceBeforeWithdrawal))
		//     // assert.equal(balanceBeforeWithdrawal, balanceBefore);

		//     await pensionContract.updateLockTime({from: unlockedAccount})

		//     result = await pensionContract.redeemCErc20Tokens(user.client.underlyingAsset, fromUnlockedAccount )
		//     await pensionContract.withdrawToken(LINK_ADDRESS, {from: unlockedAccount})

		//     // result = await pensionContract.forcedWithdraw(LINK_ADDRESS, {from: unlockedAccount});
		//     // console.log(result.logs[0].args)

		//     let stakedBalance = await pensionContract.stakedBalance(unlockedAccount, {from: unlockedAccount})
		//     assert.equal(Number(stakedBalance), 0, "Staked balance not updated after Redeem")

		//     // let balanceAfterWithdraw = await link. methods.balanceOf(unlockedAccount).call();
		//     // balanceAfterWithdrawal = web3.utils.fromWei(balanceAfterWithdraw.toString(), "ether")
		//     // console.log("User Balance After Withdrawal:",Number(balanceAfterWithdrawal))
		//     // assert.equal(Number(balanceAfterWithdrawal), Number(new BN(balanceBeforeWithdrawal).add(new BN(userAmount))))

		//     // let interest = await pensionContract.getAccruedInterest(assetAddress, fromUnlockedAccount)
		//     // console.log("Accrued Interest per year based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

		// })
		// it("Should reject withdrawal before locktime expires", async () => {
		//     await pensionContract.register(userDetails, {from: unlockedAccount });
		//     await pensionContract.setPlan(cLinkMainet, pensionPlanDetails, approvedAmountToSpend, amountToSpend, timeDuration, lockTime, { from: unlockedAccount })

		//     await link.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);
		//     await pensionContract.depositToken(LINK_ADDRESS, amountToSpend, fromUnlockedAccount)

		//     let user = await pensionContract.pensionServiceApplicant(unlockedAccount);

		//     await pensionContract.supply(user.client.underlyingAsset, fromUnlockedAccount)
		//     await pensionContract.redeemCErc20Tokens(user.client.underlyingAsset, fromUnlockedAccount ).should.be.rejectedWith(EVM_REVERT)
		//     await pensionContract.withdrawToken(LINK_ADDRESS, {from: unlockedAccount}).should.be.rejectedWith(EVM_REVERT)

		// })
	});
});
