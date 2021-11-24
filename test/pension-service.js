const EVM_REVERT = 'VM Exception while processing transaction: revert'

// const { assert } = require("chai")

// require('chai')
// .use(require('chai-as-promised'))
// .should()

const PensionServiceProvider = artifacts.require('PensionServiceProvider');
const BUSD = artifacts.require('mBUSD');


const wait = (seconds) => {
	const milliseconds = seconds * 1000
	return new Promise(resolve => setTimeout(resolve, milliseconds))
} 



contract('Pension Service Provider', ([owner, applicant]) => {
    

    let id = 1;
    let name = "JUHEL INDUSTRIES";
    let amountToSpend = 10*10^18;  // 100 mbusd
    let approvedAmountToSpend = 100*10^18;  // 1000 mbusd
    let lockTime = 30;
    let timeDuration = 1;


        beforeEach(async () => {

        // load contracts
        busd = await BUSD.new();
        pensionContract = await PensionServiceProvider.new(busd.address, busd.address, busd.address);


        

        // // check balance before register
        // result = await governanceToken.balanceOf(registee);
        // assert.equal(result.toString(), 10000, 'registering account has enough tokens')

        // await busd.approve(registerContract.address, minimumTokenRequired, { from: registee })


    })         
    describe("Registration",  () => {
        
        it("Register's Applicants", async () => {
                // register a company
            let result = await pensionContract.register(id, busd.address, name, amountToSpend, approvedAmountToSpend, lockTime, timeDuration, {from: owner} )
            // console.log(result.logs[0].args);               

        })

        it("Updates and Performs Upkeep", async () => {
            await pensionContract.register(id, busd.address, name, amountToSpend, approvedAmountToSpend, lockTime, timeDuration, {from: owner} )
            await busd.approve(pensionContract.address, approvedAmountToSpend, {from: owner});
            await pensionContract.updateTimeDurationOfDeposit({from: owner})

            let pensionContractBalanceBefore1 = await busd.balanceOf(pensionContract.address);
           console.log("Balance Before:", pensionContractBalanceBefore1.toNumber()) 

           let result1 =  await pensionContract.checkUpkeep( {from: owner})
           console.log(result1.logs[0].args[3].toNumber())

           let pensionContractBalanceAfter1 = await busd.balanceOf(pensionContract.address);
           console.log("Balance After:", pensionContractBalanceAfter1.toNumber()) 


            await wait(10)
            //  second transaction
            let pensionContractBalanceBefore2 = await busd.balanceOf(pensionContract.address);
           console.log("Balance Before:", pensionContractBalanceBefore2.toNumber()) 

            

           let result2 =  await pensionContract.checkUpkeep( {from: owner})
           console.log(result2.logs[0].args[3].toNumber())

            let pensionContractBalanceAfter2 = await busd.balanceOf(pensionContract.address);
           console.log("Balance After:", pensionContractBalanceAfter2.toNumber()) 


            await wait(10)
            //  third transaction
            let pensionContractBalanceBefore3 = await busd.balanceOf(pensionContract.address);
           console.log("Balance Before:", pensionContractBalanceBefore3.toNumber()) 

            

           let result3 =  await pensionContract.checkUpkeep( {from: owner})
           console.log(result3.logs[0].args[3].toNumber())

            let pensionContractBalanceAfter3 = await busd.balanceOf(pensionContract.address);
           console.log("Balance After:", pensionContractBalanceAfter3.toNumber()) 

            

            // let result = await pensionContract.checkUpKeep( {from: owner})
            // console.log(result)
        })
    })
    


})
