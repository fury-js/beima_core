const busdAbi = [
	{
		inputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
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
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
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
		constant: true,
		inputs: [],
		name: '_decimals',
		outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: '_name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: '_symbol',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'spender', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
		name: 'burn',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
		],
		name: 'decreaseAllowance',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'getOwner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'addedValue', type: 'uint256' },
		],
		name: 'increaseAllowance',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
		name: 'mint',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'owner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ internalType: 'address', name: 'recipient', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ internalType: 'address', name: 'sender', type: 'address' },
			{ internalType: 'address', name: 'recipient', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
];
const busdAbiTestnet = [
	{
		constant: false,
		inputs: [],
		name: 'disregardProposeOwner',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [{ name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: '_spender', type: 'address' },
			{ name: '_value', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'assetProtectionRole',
		outputs: [{ name: '', type: 'address' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: 'r', type: 'bytes32[]' },
			{ name: 's', type: 'bytes32[]' },
			{ name: 'v', type: 'uint8[]' },
			{ name: 'to', type: 'address[]' },
			{ name: 'value', type: 'uint256[]' },
			{ name: 'fee', type: 'uint256[]' },
			{ name: 'seq', type: 'uint256[]' },
			{ name: 'deadline', type: 'uint256[]' },
		],
		name: 'betaDelegatedTransferBatch',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: 'sig', type: 'bytes' },
			{ name: 'to', type: 'address' },
			{ name: 'value', type: 'uint256' },
			{ name: 'fee', type: 'uint256' },
			{ name: 'seq', type: 'uint256' },
			{ name: 'deadline', type: 'uint256' },
		],
		name: 'betaDelegatedTransfer',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: '_from', type: 'address' },
			{ name: '_to', type: 'address' },
			{ name: '_value', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [],
		name: 'initializeDomainSeparator',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [{ name: '', type: 'uint8' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [],
		name: 'unpause',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_addr', type: 'address' }],
		name: 'unfreeze',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [],
		name: 'claimOwnership',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_newSupplyController', type: 'address' }],
		name: 'setSupplyController',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'paused',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [{ name: '_addr', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [],
		name: 'initialize',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [],
		name: 'pause',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'getOwner',
		outputs: [{ name: '', type: 'address' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [{ name: 'target', type: 'address' }],
		name: 'nextSeqOf',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_newAssetProtectionRole', type: 'address' }],
		name: 'setAssetProtectionRole',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_addr', type: 'address' }],
		name: 'freeze',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'owner',
		outputs: [{ name: '', type: 'address' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [{ name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_newWhitelister', type: 'address' }],
		name: 'setBetaDelegateWhitelister',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_value', type: 'uint256' }],
		name: 'decreaseSupply',
		outputs: [{ name: 'success', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [{ name: '_addr', type: 'address' }],
		name: 'isWhitelistedBetaDelegate',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: '_to', type: 'address' },
			{ name: '_value', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_addr', type: 'address' }],
		name: 'whitelistBetaDelegate',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_proposedOwner', type: 'address' }],
		name: 'proposeOwner',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_value', type: 'uint256' }],
		name: 'increaseSupply',
		outputs: [{ name: 'success', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'betaDelegateWhitelister',
		outputs: [{ name: '', type: 'address' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'proposedOwner',
		outputs: [{ name: '', type: 'address' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_addr', type: 'address' }],
		name: 'unwhitelistBetaDelegate',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{ name: '_owner', type: 'address' },
			{ name: '_spender', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_addr', type: 'address' }],
		name: 'wipeFrozenAddress',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'EIP712_DOMAIN_HASH',
		outputs: [{ name: '', type: 'bytes32' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [{ name: '_addr', type: 'address' }],
		name: 'isFrozen',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'supplyController',
		outputs: [{ name: '', type: 'address' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [],
		name: 'reclaimBUSD',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'from', type: 'address' },
			{ indexed: true, name: 'to', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'owner', type: 'address' },
			{ indexed: true, name: 'spender', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'currentOwner', type: 'address' },
			{ indexed: true, name: 'proposedOwner', type: 'address' },
		],
		name: 'OwnershipTransferProposed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [{ indexed: true, name: 'oldProposedOwner', type: 'address' }],
		name: 'OwnershipTransferDisregarded',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'oldOwner', type: 'address' },
			{ indexed: true, name: 'newOwner', type: 'address' },
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{ anonymous: false, inputs: [], name: 'Pause', type: 'event' },
	{ anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
	{
		anonymous: false,
		inputs: [{ indexed: true, name: 'addr', type: 'address' }],
		name: 'AddressFrozen',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [{ indexed: true, name: 'addr', type: 'address' }],
		name: 'AddressUnfrozen',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [{ indexed: true, name: 'addr', type: 'address' }],
		name: 'FrozenAddressWiped',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'oldAssetProtectionRole', type: 'address' },
			{ indexed: true, name: 'newAssetProtectionRole', type: 'address' },
		],
		name: 'AssetProtectionRoleSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'to', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
		name: 'SupplyIncreased',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'from', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
		name: 'SupplyDecreased',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'oldSupplyController', type: 'address' },
			{ indexed: true, name: 'newSupplyController', type: 'address' },
		],
		name: 'SupplyControllerSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'from', type: 'address' },
			{ indexed: true, name: 'to', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
			{ indexed: false, name: 'seq', type: 'uint256' },
			{ indexed: false, name: 'fee', type: 'uint256' },
		],
		name: 'BetaDelegatedTransfer',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'oldWhitelister', type: 'address' },
			{ indexed: true, name: 'newWhitelister', type: 'address' },
		],
		name: 'BetaDelegateWhitelisterSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [{ indexed: true, name: 'newDelegate', type: 'address' }],
		name: 'BetaDelegateWhitelisted',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [{ indexed: true, name: 'oldDelegate', type: 'address' }],
		name: 'BetaDelegateUnwhitelisted',
		type: 'event',
	},
];
const xendTokenBsc = '0x4a080377f83D669D7bB83B3184a8A5E61B500608';
const xendIndiviualSavingsContract = "0x1349236eFfA145CbE2Ad80A20fFee192e35131fa";
const xendIndiviualSavingsContractTestnet = "0x1349236eFfA145CbE2Ad80A20fFee192e35131fa";
const busdAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
const busdAddressTesnet = '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee';
const upkeepInterval = 30;

const { assert } = require('chai');

require('chai').use(require('chai-as-promised')).should();

const PensionServiceProvider = artifacts.require('PensionServiceProvider');



contract('Pension Service Provider', ([owner, applicant]) => {
    let userDetails = 'chukky';

    const unlockedAccount = '0xe876923f116c1aC6E439F06d8aF5a4bD21c73Eb8';

    const fromUnlockedAccount = {
		from: unlockedAccount,
		gasLimit: web3.utils.toHex(500000),
		gasPrice: web3.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
	};

    

    beforeEach(async () => {

        let amountToSpend = web3.utils.toWei("10", 'ether');  // 1 usdc tokens
        let approvedAmountToSpend = web3.utils.toWei('100', 'ether');

        // load contracts
        // busd = await BUSD.new();
        pensionContract = await PensionServiceProvider.new(
					xendTokenBsc,
					busdAddressTesnet,
					xendIndiviualSavingsContractTestnet,
					upkeepInterval,
				);
        // let link = new web3.eth.Contract(LINK_ABI, LINK_ADDRESS);
        busdTokenTestnet = new web3 .eth.Contract(busdAbiTestnet, busdAddressTesnet)
        // console.log(usdc_kovan)


    }) 

    describe("Xend pensions test",  () => {
        
        it("Register's Applicants", async () => {
              // register a company
            let resut = await pensionContract.register(userDetails, {from: unlockedAccount} )
            // console.log(result.logs[0].args);               

        })

        it("Accepts Deposits and Invests", async () => {
            await pensionContract.register(userDetails, {from: unlockedAccount });
            let approveResult = await busdTokenTestnet.methods.approve(pensionContract.address, amountToSpend).send(fromUnlockedAccount);
            let deposit = await pensionContract.depositToXendFinance(amountToSpend, fromUnlockedAccount)
            console.log("First deposit:", Number(deposit.logs[0].args.amountSpent))

            // let deposit = await pensionContract.deposit(amountToSpend, {from: unlockedAccount})
        })
    })
})