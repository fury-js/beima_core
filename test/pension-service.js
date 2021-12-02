// const web3 = require("web3")
let BN = web3.utils.BN;
const EVM_REVERT = 'VM Exception while processing transaction: revert'
const LINK_ADDRESS = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
const LINK_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]

const { assert } = require("chai")

require('chai')
.use(require('chai-as-promised'))
.should()

const PensionServiceProvider = artifacts.require('PensionServiceProvider');
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
    let userDetails = "JUHEL INDUSTRIES";
    let nextOfKinDetails = "chukky";
    let pensionPlanDetails = "Flexible";
    let amountToSpend = web3.utils.toWei("10000", 'ether');  // 10000 link tokens
    let approvedAmountToSpend = web3.utils.toWei('100000', 'ether');  // 100000 link tokens
    let lockTime = 30;
    let timeDuration = 1;
    // const link = new web3.eth.Contract(LINK_ABI, LINK_ADDRESS);


    const comptrollerAddressMainnet = '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B';
	const priceOracleAddressMainnet = '0x02557a5e05defeffd4cae6d83ea3d173b272c904';
    const unlockedAccount = '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8';

    const xendOnEthereum = '0xE4CFE9eAa8Cdb0942A80B7bC68fD8Ab0F6D44903';
    const cLINK = '0xface851a4921ce59e912d19329929ce6da6eb0c7';

    const fromUnlockedAccount = {
			from: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
			gasLimit: web3.utils.toHex(500000),
			gasPrice: web3.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
		};




        beforeEach(async () => {

        // load contracts
        // busd = await BUSD.new();
        pensionContract = await PensionServiceProvider.new(
			xendOnEthereum,
			comptrollerAddressMainnet,
			priceOracleAddressMainnet,
			priceOracleAddressMainnet,
            upkeepInterval
		);
        keeper = await Keeper.new(pensionContract.address)
        link = new web3.eth.Contract(LINK_ABI, LINK_ADDRESS);


    })         
    describe("Beima Pensions Tests",  () => {
        
        it("Register's Applicants", async () => {
                // register a company
            let result = await pensionContract.register(userDetails, nextOfKinDetails , {from: unlockedAccount} )
            // console.log(result.logs[0].args);               

        })

        it("Accepts Deposits and Invests", async () => {
            await pensionContract.register(userDetails, nextOfKinDetails,{ from: unlockedAccount });
            // await pensionContract.setPlan(cLINK, pensionPlanDetails, approvedAmountToSpend, amountToSpend, timeDuration, lockTime, { from: unlockedAccount })
            // const approveResult = await link.methods.approve(pensionContract.address, amountToSpend).send(fromUnlockedAccount);
            // let deposit = await pensionContract.deposit(amountToSpend, fromUnlockedAccount)
            // console.log(deposit.logs[0].args.amountSpent.toString())

            // let deposit = await pensionContract.deposit(amountToSpend, {from: unlockedAccount})
        })

        it("Updates and Performs Upkeep To invest in Compound finance protocol", async () => {
			await pensionContract.register( userDetails, nextOfKinDetails, { from: unlockedAccount });
            result = await pensionContract.setPlan(cLINK, pensionPlanDetails, approvedAmountToSpend, amountToSpend, timeDuration, lockTime, { from: unlockedAccount })
            // console.log(result.logs[0].args)
			const approveResult = await link.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);
			await pensionContract.updateTimeDurationOfDeposit(fromUnlockedAccount);
			// console.log(update.logs[0].args.timeDuration.toString())
			await wait(2);
			// let result1 = await keeper.check({ from: owner });
			let result1 = await pensionContract.checkUpkeep("0x");
			console.log(result1);

		    // check balance before upkeep
			balanceBefore = await link.methods.balanceOf(unlockedAccount).call();
			console.log("link balance before supply:", web3.utils.fromWei(balanceBefore.toString(), "ether"));

			await wait(3);
			// await pensionContract.updateTimeDurationOfDeposit({ from: unlockedAccount });
			
            let result2 = await pensionContract.performUpkeep("0x", fromUnlockedAccount)	
            console.log(result2.logs[0].args);

            balanceAfter = await link.methods.balanceOf(unlockedAccount).call();
			console.log("link balance after supply:", web3.utils.fromWei(balanceAfter.toString(), "ether"));

		})

        it("Updates User deposited amount and Reduces User Approved amount", async () => {
            await pensionContract.register(userDetails, nextOfKinDetails, { from: unlockedAccount });
            await pensionContract.setPlan(cLINK, pensionPlanDetails, approvedAmountToSpend, amountToSpend, timeDuration, lockTime, { from: unlockedAccount })

            await link.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);
			await pensionContract.updateTimeDurationOfDeposit(fromUnlockedAccount);
            let upkeep = await pensionContract.checkUpkeep("0x");
            // console.log(upkeep);
            await pensionContract.performUpkeep("0x", fromUnlockedAccount);

            result = await pensionContract.pensionServiceApplicant(unlockedAccount);
            // console.log(result)

            // console.log("Deposited Amount:", web3.utils.fromWei(result.client[depositedAmount].toString(), "ether"))
            // console.log("Remaing Approved Amount set by User:", web3.utils.fromWei(result.client[approvedAmountToSpend].toString(), "ether"))
            // console.log("Deafult amount to deposit on intervals:", web3.utils.fromWei(result.client[amountToSpend].toString(), "ether"))

            await wait(2)
            // console.log();
            // 2nd transaction
            await pensionContract.performUpkeep("0x", fromUnlockedAccount);

            result = await pensionContract.pensionServiceApplicant(unlockedAccount);
            // console.log(`Increased deposited amount by ${web3.utils.fromWei(amountToSpend)}. Deposited Amount currently at:`, web3.utils.fromWei(result.client[depositedAmount], "ether"))
            // console.log(`Reduced approved Amount to Spend by Contract by ${web3.utils.fromWei(amountToSpend)}. Approved Amount to Spend currently at: `, web3.utils.fromWei(result.client[approvedAmountToSpend].toString(), "ether"))
            // console.log("Default amount to spend set by User on Registeration:", web3.utils.fromWei(result.client[amountToSpend].toString(), "ether"))
            // console.log(result)
        })

        it("Gets User Accrued Interest PerBlock", async () => {
            let interest;
            await pensionContract.register(userDetails, nextOfKinDetails, { from: unlockedAccount });
            await pensionContract.setPlan(cLINK, pensionPlanDetails, approvedAmountToSpend, amountToSpend, timeDuration, lockTime, { from: unlockedAccount })

            await link.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);
			await pensionContract.updateTimeDurationOfDeposit(fromUnlockedAccount);
            let upkeep = await pensionContract.checkUpkeep("0x");
            // console.log(result)
            await pensionContract.performUpkeep("0x", fromUnlockedAccount);

            await wait(2)
            // 2nd transaction
            await pensionContract.performUpkeep("0x", fromUnlockedAccount);

            interest = await pensionContract.getAccruedInterest(fromUnlockedAccount)
            console.log("Accrued Interest per block based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

            // await wait(5);

            await pensionContract.performUpkeep("0x", fromUnlockedAccount);

            interest = await pensionContract.getAccruedInterest(fromUnlockedAccount)
            console.log("Accrued Interest per block based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

            // await wait(10);

            await pensionContract.performUpkeep("0x", fromUnlockedAccount);

            interest = await pensionContract.getAccruedInterest(fromUnlockedAccount)
            console.log("Accrued Interest per block based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

            // await wait(15);
            await pensionContract.performUpkeep("0x", fromUnlockedAccount);

            interest = await pensionContract.getAccruedInterest(fromUnlockedAccount)
            console.log("Accrued Interest per block based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))


        })

        it("Wthdraws Underlying Assets and Credits the Owner of the Assets", async () => {
            await pensionContract.register(userDetails, nextOfKinDetails,{ from: unlockedAccount });
            await pensionContract.setPlan(cLINK, pensionPlanDetails, approvedAmountToSpend, amountToSpend, timeDuration, lockTime, { from: unlockedAccount })

            await link.methods.approve(pensionContract.address, approvedAmountToSpend).send(fromUnlockedAccount);
			await pensionContract.updateTimeDurationOfDeposit(fromUnlockedAccount);
            let upkeep = await pensionContract.checkUpkeep("0x");
            // console.log(result)
            await pensionContract.performUpkeep("0x", fromUnlockedAccount);

            await wait(2)
            // 2nd transaction
            await pensionContract.performUpkeep("0x", fromUnlockedAccount);
            let user = await pensionContract.pensionServiceApplicant(unlockedAccount);
            // userAmount = web3.utils.fromWei(user.client[0].depositedAmount.toString(), "ether")
            // console.log(user.client[0].depositedAmount)



            // check balance before withdrawal
            let balanceBeforeWithdraw = await link.methods.balanceOf(unlockedAccount).call();
            balanceBeforeWithdrawal = web3.utils.fromWei(balanceBeforeWithdraw.toString(), "ether")
            console.log(balanceBeforeWithdrawal)
            // assert.equal(balanceBeforeWithdrawal, balanceBefore);

            result = await pensionContract.withdraw({from: unlockedAccount});

            let balanceAfterWithdraw = await link.methods.balanceOf(unlockedAccount).call();
            balanceAfterWithdrawal = web3.utils.fromWei(balanceAfterWithdraw.toString(), "ether")
            console.log(balanceAfterWithdrawal)
            // assert.equal(Number(balanceAfterWithdrawal), Number(new BN(balanceBeforeWithdrawal).add(new BN(userAmount))))

            // let interest = await pensionContract.getAccruedInterest(fromUnlockedAccount)
            // console.log("Accrued Interest per year based on deposited amount:", web3.utils.fromWei(interest.toString(), "ether"))

        })
    })
    


})
