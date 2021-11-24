const BUSD = artifacts.require("mBUSD");
const PensionServiceProvider = artifacts.require("PensionServiceProvider");

module.exports = async function (deployer, network, accounts) {
    const comptrollerAddressMainnet = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B"
    const priceOracleAddressMainnet = "0x02557a5e05defeffd4cae6d83ea3d173b272c904"
    const cEth = "0x41B5844f4680a8C38fBb695b7F9CFd1F64474a72"

    await deployer.deploy(BUSD);
    const busd = await BUSD.deployed();

    await deployer.deploy(PensionServiceProvider, BUSD.address, comptrollerAddressMainnet, priceOracleAddressMainnet)
    const pensionContract = await PensionServiceProvider.deployed()

    // console.log(pensionContract)
    console.log("Mock Busd address Kovan:", BUSD.address)
    console.log("Pension Contract:", PensionServiceProvider.address)




};