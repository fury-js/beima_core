// const BUSD = artifacts.require("mBUSD");
const Beima = artifacts.require("Beima");
const MockKeeper = artifacts.require("MockKeeper");
const PensionServiceProvider = artifacts.require("PensionServiceProvider")

module.exports = async function (deployer, network, accounts) {
    const comptrollerAddressMainnet = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B"
    const priceOracleAddressMainnet = "0x02557a5e05defeffd4cae6d83ea3d173b272c904"
    // const comptrollerAddressKovan = "0x5eAe89DC1C671724A672ff0630122ee834098657"
    // const priceOracleAddressKovan = "0x37ac0cb24b5DA520B653A5D94cFF26EB08d4Dc02"
    const comptrollerAddressRinkeby = "0x2EAa9D77AE4D8f9cdD9FAAcd44016E746485bddb"
    const priceOracleAddressRinkeby =  "0xD2B1eCa822550d9358e97e72c6C1a93AE28408d0"

    // const cEth = "0x41B5844f4680a8C38fBb695b7F9CFd1F64474a72"
    const xend = '0xE4CFE9eAa8Cdb0942A80B7bC68fD8Ab0F6D44903';
    const xendTokenBsc = '0x4a080377f83D669D7bB83B3184a8A5E61B500608';
    const xendIndiviualSavingsContract = "0x1349236eFfA145CbE2Ad80A20fFee192e35131fa";
    const xendIndiviualSavingsContractTestnet = "0x92Da3E991A22b415Fc8EeDD91B97cA92232421Dc";
    const busdAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
    const busdAddressTesnet = '0x3b1F033dD955f3BE8649Cc9825A2e3E194765a3F';

    const upkeepInterval = 30;


        // await deployer.deploy(BUSD);
        // const busd = await BUSD.deployed();
      if(network == "4" || network == "1") {
        await deployer.deploy(
          Beima,
          xend,
          comptrollerAddressRinkeby,
          comptrollerAddressRinkeby,
          priceOracleAddressRinkeby,
          upkeepInterval,
        );
        const pensionContract = await Beima.deployed();
      }
      
      else {
        await deployer.deploy(PensionServiceProvider, xendTokenBsc, busdAddressTesnet, xendIndiviualSavingsContractTestnet, upkeepInterval )
        const pensionServiceContract = await PensionServiceProvider.deployed()
        console.log("Pension Service deployed at:", PensionServiceProvider.address)
      }

        // console.log(pensionContract)
        // console.log("Mock Busd address Kovan:", BUSD.address)
        // console.log("Pension Contract:", Beima.address)

        // await deployer.deploy(MockKeeper, Beima.address)
        // const keeper = await MockKeeper.deployed()
        // console.log('MockKeeper Contract deployed at:', MockKeeper.address);


   




};