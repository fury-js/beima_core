// const web3 = require("web3")
let BN = web3.utils.BN;
const EVM_REVERT = 'VM Exception while processing transaction: revert'
const LINK_ADDRESS = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
const LINK_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]

const { assert } = require("chai")
const USDC_ABI_KOVAN = [{"inputs":[{"internalType":"uint256","name":"_initialAmount","type":"uint256"},{"internalType":"string","name":"_tokenName","type":"string"},{"internalType":"uint8","name":"_decimalUnits","type":"uint8"},{"internalType":"string","name":"_tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"allocateTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const USDC_ADDRESS_KOVAN = "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede"

require('chai')
.use(require('chai-as-promised'))
.should()

const PensionServiceProvider = artifacts.require('Beima');
// const BUSD = artifacts.require('mBUSD');
const Keeper = artifacts.require("MockKeeper")


const wait = (seconds) => {
	const milliseconds = seconds * 1000
	return new Promise(resolve => setTimeout(resolve, milliseconds))
} 



contract('Pension Service Provider', ([owner, applicant]) => {
    
    let balanceBefore;
    let balanceAfter;
    let result;
    let upkeepInterval = 1;
    let userDetails = "chukky";
    // let= "chukky";
    let pensionPlanDetails = "Flexible";
    let amountToSpend = web3.utils.toWei("1000", 'ether');  // 1 usdc tokens
    let approvedAmountToSpend = web3.utils.toWei('10000', 'ether');  // 10 link tokens
    // let amountToSpend = 10000;
    // let approvedAmountToSpend = 100000000;
    let lockTime = 30;
    let timeDuration = 1;
    const link = new web3.eth.Contract(LINK_ABI, LINK_ADDRESS);


    const comptrollerAddressMainnet = '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B';
	const priceOracleAddressMainnet = '0x02557a5e05defeffd4cae6d83ea3d173b272c904';
    const unlockedAccount = '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8';
    // const unlockedAccount = '0xd037f8DBd4749ffb3Df62316049c66061B36a6B2';

    const xendOnEthereum = '0xE4CFE9eAa8Cdb0942A80B7bC68fD8Ab0F6D44903';
    // const cUSDC = '0xface851a4921ce59e912d19329929ce6da6eb0c7';
     const cUSDC = '0x4a92E71227D294F041BD82dd8f78591B75140d63';
     const cLinkMainet = "0xface851a4921ce59e912d19329929ce6da6eb0c7"

    // const comptrollerAddressMainnet = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B"
    // const priceOracleAddressMainnet = "0x02557a5e05defeffd4cae6d83ea3d173b272c904"

    const comptrollerAddressKovan = "0x5eAe89DC1C671724A672ff0630122ee834098657"
    // const priceOracleAddressKovan = "0x37ac0cb24b5DA520B653A5D94cFF26EB08d4Dc02"
    const cEth = "0x41B5844f4680a8C38fBb695b7F9CFd1F64474a72"
    const xend = '0xE4CFE9eAa8Cdb0942A80B7bC68fD8Ab0F6D44903';
    // const upkeepInterval = 30;

    // const accounts = await web3.eth.getAccounts();
	// const account = accounts[0];

    const fromUnlockedAccount = {
			from: unlockedAccount,
			gasLimit: web3.utils.toHex(500000),
			gasPrice: web3.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
		};




        beforeEach(async () => {

        // load contracts
        // busd = await BUSD.new();
        pensionContract = await PensionServiceProvider.new(
					xendOnEthereum,
					comptrollerAddressKovan,
					comptrollerAddressMainnet,
					priceOracleAddressMainnet,
					upkeepInterval,
				);
        keeper = await Keeper.new(pensionContract.address)
        // let link = new web3.eth.Contract(LINK_ABI, LINK_ADDRESS);
        usdc_kovan = new web3 .eth.Contract(USDC_ABI_KOVAN, USDC_ADDRESS_KOVAN)
        // console.log(usdc_kovan)


    })         
    describe("Beima Pensions Tests",  () => {
        
        it("Register's Applicants", async () => {
              // register a company
            let resut = await pensionContract.register(userDetails, {from: unlockedAccount} )
            // console.log(result.logs[0].args);               

        })

        it("Accepts Deposits and Invests", async () => {
            await pensionContract.register(userDetails, {from: unlockedAccount });
            await pensionContract.setPlan(cLinkMainet, pensionPlanDetails, approvedAmountToSpend, amountToSpend, timeDuration, lockTime, { from: unlockedAccount })
            let approveResult = await link.methods.approve(pensionContract.address, amountToSpend).send(fromUnlockedAccount);
            let deposit = await pensionContract.depositToken(LINK_ADDRESS, amountToSpend, fromUnlockedAccount)
            console.log("First deposit:", Number(deposit.logs[0].args.amountSpent))

            // let deposit = await pensionContract.deposit(amountToSpend, {from: unlockedAccount})
        })

        // it("Updates and Performs Upkeep To invest in Compound finance protocol", async () => {
		// 	await pensionContract.register( userDetails,{ from: unlockedAccount });
        //     result = await pensionContract.setPlan(cLinkMainet, pensionPlanDetails, approvedAmountToSpend, amountToSpend, timeDuration, lockTime, { from: unlockedAccount })
        //     // console.log(result.logs[0].args)
		// 	const approveResult = await link.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);
			// await pensionContract.updateTimeDurationOfDeposit(fromUnlockedAccount);
		// 	// console.log(update.logs[0].args.timeDuration.toString())
		// 	await wait(2);
		// 	// let upkeep = await keeper.check({ from: owner });
		// 	let upkeep = await pensionContract.checkUpkeep("0x");
		// 	// console.log(upkeep[1]);

		//     // check balance before upkeep
		// 	balanceBefore = await link.balanceOf(unlockedAccount).call();
		// 	console.log("usdc_kovan balance before supply:", web3.utils.fromWei(balanceBefore.toString(), "ether"));

		// 	await wait(3);
		// 	// await pensionContract.updateTimeDurationOfDeposit({ from: unlockedAccount });
			
        //     let result2 = await pensionContract.performUpkeep(upkeep[1], fromUnlockedAccount)	
        //     console.log(result2.logs[0].args[2].toString());

        //     balanceAfter = await link.balanceOf(unlockedAccount).call();
		// 	console.log("usdc_kovan balance after supply:", web3.utils.fromWei(balanceAfter.toString(), "ether"));

		// })

        it("Updates User deposited amount and Reduces User Approved amount", async () => {
            await pensionContract.register(userDetails,{ from: unlockedAccount });
            await pensionContract.setPlan(cLinkMainet, pensionPlanDetails, approvedAmountToSpend, amountToSpend, timeDuration, lockTime, { from: unlockedAccount })

            await link.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);
			// await pensionContract.updateTimeDurationOfDeposit(fromUnlockedAccount);
            let deposit = await pensionContract.depositToken(LINK_ADDRESS, amountToSpend, fromUnlockedAccount)
            // let upkeep = await pensionContract.checkUpkeep("0x");
            // // console.log(upkeep);
            // await pensionContract.performUpkeep(upkeep[1], fromUnlockedAccount);
            console.log(deposit.logs[0].args)

            result = await pensionContract.assets( LINK_ADDRESS, unlockedAccount, fromUnlockedAccount);
;
            console.log(result.toString())

            // console.log("Deposited Amount:", web3.utils.fromWei(result.client.depositedAmount.toString(), "ether"))
            // console.log("Remaing Approved Amount set by User:", web3.utils.fromWei(result.client.approvedAmountToSpend.toString(), "ether"))
            // console.log("Deafult amount to deposit on intervals:", web3.utils.fromWei(result.client.amountToSpend.toString(), "ether"))

            await wait(2)
            // console.log();
            // 2nd transaction
            // await pensionContract.performUpkeep(upkeep[1], fromUnlockedAccount);
            await pensionContract.depositToken(LINK_ADDRESS, amountToSpend, fromUnlockedAccount)

            result = await pensionContract.pensionServiceApplicant(unlockedAccount);
            // console.log(`Increased deposited amount by ${web3.utils.fromWei(amountToSpend.toString(), "ether")}. Deposited Amount currently at:`, web3.utils.fromWei(result.client.depositedAmount.toString(), "ether"))
            // console.log(`Reduced approved Amount to Spend by Contract by ${web3.utils.fromWei(amountToSpend.toString(), "ether")}. Approved Amount to Spend currently at: `, web3.utils.fromWei(result.client.approvedAmountToSpend.toString(), "ether"))
            // console.log("Default amount to spend set by User on Registeration:", web3.utils.fromWei(reslt.client.amountToSpend.toString(), "ether"))
        })

        it("Gets User Accrued Interest PerBlock", async () => {
            let interest;
            await pensionContract.register(userDetails,{ from: unlockedAccount });
            await pensionContract.setPlan(cLinkMainet, pensionPlanDetails, approvedAmountToSpend, amountToSpend, timeDuration, lockTime, { from: unlockedAccount })
            

            await link.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);
			// await pensionContract.updateTimeDurationOfDeposit(fromUnlockedAccount);
            // let upkeep = await pensionContract.checkUpkeep("0x");
            let deposit = await pensionContract.depositToken(LINK_ADDRESS, amountToSpend, fromUnlockedAccount)
            // console.log(result)
            // await pensionContract.performUpkeep(upkeep[1], fromUnlockedAccount);

            await wait(2)
            // 2nd transaction
            // await pensionContract.performUpkeep(upkeep[1], fromUnlockedAccount);
            await pensionContract.depositToken(LINK_ADDRESS, amountToSpend, fromUnlockedAccount)
            let user = await pensionContract.pensionServiceApplicant(unlockedAccount);
            let assetAddress = await pensionContract.getAssetAddress(user.client.underlyingAsset)

            interest = await pensionContract.getAccruedInterest(assetAddress, fromUnlockedAccount)
            console.log("Accrued Interest per block based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

            // await wait(5);

            // await pensionContract.performUpkeep(upkeep[1], fromUnlockedAccount);
            await pensionContract.depositToken(LINK_ADDRESS, amountToSpend, fromUnlockedAccount)

            interest = await pensionContract.getAccruedInterest(assetAddress, fromUnlockedAccount)
            console.log("Accrued Interest per block based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

            // await wait(10);

            // await pensionContract.performUpkeep(upkeep[1], fromUnlockedAccount);
            await pensionContract.depositToken(LINK_ADDRESS, amountToSpend, fromUnlockedAccount)

            interest = await pensionContract.getAccruedInterest(assetAddress, fromUnlockedAccount)
            console.log("Accrued Interest per block based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

            // await wait(15);
            // await pensionContract.performUpkeep(upkeep[1], fromUnlockedAccount);

            interest = await pensionContract.getAccruedInterest(assetAddress, fromUnlockedAccount)
            console.log("Accrued Interest per block based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

            await pensionContract.supply(user.client.underlyingAsset, fromUnlockedAccount)

        })

        it("Wthdraws Underlying Assets and Credits the Owner of the Assets", async () => {
            await pensionContract.register(userDetails, {from: unlockedAccount });
            await pensionContract.setPlan(cLinkMainet, pensionPlanDetails, approvedAmountToSpend, amountToSpend, timeDuration, lockTime, { from: unlockedAccount })

            await link.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);
			// await pensionContract.updateTimeDurationOfDeposit(fromUnlockedAccount);
            // let upkeep = await pensionContract.checkUpkeep("0x");
            // // console.log(result)
            // await pensionContract.performUpkeep(upkeep[1], fromUnlockedAccount);
            await pensionContract.depositToken(LINK_ADDRESS, amountToSpend, fromUnlockedAccount)

            await wait(2)
            // 2nd transaction
            await pensionContract.depositToken(LINK_ADDRESS, amountToSpend, fromUnlockedAccount)
            let UserAssetamount = await pensionContract.assets( LINK_ADDRESS, unlockedAccount, fromUnlockedAccount);
            let user = await pensionContract.pensionServiceApplicant(unlockedAccount);

            await pensionContract.supply(user.client.underlyingAsset, fromUnlockedAccount)

            userAmount = web3.utils.fromWei(UserAssetamount.toString(), "ether")
            console.log(userAmount)
            console.log("cAsset to withdraw", user.client.underlyingAsset)



            // check balance before withdrawal
            let balanceBeforeWithdraw = await link.methods.balanceOf(unlockedAccount).call();
            balanceBeforeWithdrawal = web3.utils.fromWei(balanceBeforeWithdraw.toString(), "ether")
            console.log("User Balance Before Withdrawal:",Number(balanceBeforeWithdrawal))
            // assert.equal(balanceBeforeWithdrawal, balanceBefore);

            // let redeemType = false;

            result = await pensionContract.redeemCErc20Tokens(UserAssetamount, user.client.underlyingAsset, fromUnlockedAccount )

            result = await pensionContract.withdrawToken(LINK_ADDRESS, UserAssetamount, {from: unlockedAccount});
            console.log(result.logs[0].args)

            // let balanceAfterWithdraw = await link. methods.balanceOf(unlockedAccount).call();
            // balanceAfterWithdrawal = web3.utils.fromWei(balanceAfterWithdraw.toString(), "ether")
            // console.log("User Balance After Withdrawal:",Number(balanceAfterWithdrawal))
            // assert.equal(Number(balanceAfterWithdrawal), Number(new BN(balanceBeforeWithdrawal).add(new BN(userAmount))))

            // let interest = await pensionContract.getAccruedInterest(assetAddress, fromUnlockedAccount)
            // console.log("Accrued Interest per year based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

        })
    })
    


})
