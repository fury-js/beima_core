// const BUSD = artifacts.require("mBUSD");
const PensionServiceProvider = artifacts.require("PensionServiceProvider");
const MockKeeper = artifacts.require("MockKeeper");

module.exports = async function (deployer, network, accounts) {
    const comptrollerAddressMainnet = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B"
    const priceOracleAddressMainnet = "0x02557a5e05defeffd4cae6d83ea3d173b272c904"
    const comptrollerAddressKovan = "0x5eAe89DC1C671724A672ff0630122ee834098657"
    const priceOracleAddressKovan = "0x37ac0cb24b5DA520B653A5D94cFF26EB08d4Dc02"
    const cEth = "0x41B5844f4680a8C38fBb695b7F9CFd1F64474a72"
    const xend = '0xE4CFE9eAa8Cdb0942A80B7bC68fD8Ab0F6D44903';


        // await deployer.deploy(BUSD);
        // const busd = await BUSD.deployed();

        await deployer.deploy(
					PensionServiceProvider,
					xend,
					comptrollerAddressKovan,
					priceOracleAddressKovan,
					priceOracleAddressMainnet,
				);
        const pensionContract = await PensionServiceProvider.deployed()

        // console.log(pensionContract)
        // console.log("Mock Busd address Kovan:", BUSD.address)
        console.log("Pension Contract:", PensionServiceProvider.address)

        await deployer.deploy(MockKeeper, PensionServiceProvider.address)
        const keeper = await MockKeeper.deployed()
        console.log('MockKeeper Contract deployed at:', MockKeeper.address,);

   




};