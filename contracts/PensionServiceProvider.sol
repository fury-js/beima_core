//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import './CTokenInterface.sol';
import './ComptrollerInterface.sol';
import './PriceOracleInterface.sol';


// import "./XendFinanceIndividual_Yearn_V1.sol";




contract PensionServiceProvider is KeeperCompatibleInterface {
    using SafeMath for uint;
    ComptrollerInterface public comptroller;
	PriceOracleInterface public priceOracle;
    // XendFinanceIndividual_Yearn_V1 public xendFinance;


    IERC20 public busd;
    // bool upKeep;



    // A user Object
    struct User {
        uint256 id;
        address underlyingAsset;
        address payable userAddress;
        string  userDetails;
        uint256 depositedAmount;
        uint256 amountToSpend;
        uint256 approvedAmountToSpend;
        uint256 startTime;
        uint256 timeDurationOfdeposit;
        uint256 lockTime;
    }

    event Register(address applicant, string applicantDetails, uint approvedAmountByApplicant, uint lockTime);
    event Withdraw(address from, address to, uint amount);
    event Deposit(address user, uint amount);
    event Upkeep(address sender, bool upkeep);
    event MyLog(string, uint256);

    mapping(address => User) public pensionServiceApplicant;

    // keep track of registered users
    mapping(address => bool) public isRegistered;

    User[] public users;


    constructor(address _stableCoin, address _comptroller, address _priceOracle )  {
        busd = IERC20(_stableCoin);
        // xendFinance = XendFinanceIndividual_Yearn_V1(_xendFinanceAddress);
        comptroller = ComptrollerInterface(_comptroller);
		priceOracle = PriceOracleInterface(_priceOracle);
        
    }

    function register(
        uint256 _id, 
        address _underlyingAsset,
        string memory _userDetails, 
        uint256 _amountToSpend,
        uint256 _approvedAmountToSpend,  
        uint256 _timeDurationOfDeposit
        ) 
        public {
        require(!isRegistered[msg.sender], "Caller address already exists");

        User memory user = User({
            id: _id,
            userAddress: payable(msg.sender),
            underlyingAsset: _underlyingAsset,
            userDetails: _userDetails,
            depositedAmount: 0,
            amountToSpend: _amountToSpend,
            approvedAmountToSpend: _approvedAmountToSpend,
            startTime: block.timestamp,
            timeDurationOfdeposit: block.timestamp + _timeDurationOfDeposit,
            lockTime: 0
        });

        pensionServiceApplicant[msg.sender] = user;
        users.push(user);
        isRegistered[msg.sender] = true;

        emit Register(msg.sender, user.userDetails, user.approvedAmountToSpend, user.lockTime);
    }



    function deposit(uint256 _amount) public payable {
        User storage user = pensionServiceApplicant[msg.sender];
        address cTokenaddress = user.underlyingAsset;
        _supply(cTokenaddress, _amount);
        user.depositedAmount = user.depositedAmount + _amount;
        emit Deposit(msg.sender, user.depositedAmount);

    }



    function _enterMarket(address _cTokenaddress) internal {
		address[] memory markets = new address[](1);
		markets[0] = _cTokenaddress;
		uint[] memory results = comptroller.enterMarkets(markets);
		require( results[0] == 0, 'comptroller#enterMarkets() failed. see Compound ErrorReporter.sol');
	}


    // function supplyErc20ToCompound(
    //     address _erc20Contract,
    //     address _cErc20Contract,
    //     uint256 _numTokensToSupply
    // ) public returns (uint) {
    //     // Create a reference to the underlying asset contract, like DAI.
    //     IERC20 underlying = IERC20(_erc20Contract);

    //     // Create a reference to the corresponding cToken contract, like cDAI
    //     CTokenInterface cToken = CTokenInterface(_cErc20Contract);

    //     // Amount of current exchange rate from cToken to underlying
    //     // uint256 exchangeRateMantissa = cToken.exchangeRateCurrent();
    //     // emit MyLog("Exchange Rate (scaled up): ", exchangeRateMantissa);

    //     // Amount added to you supply balance this block
    //     // uint256 supplyRateMantissa = cToken.supplyRatePerBlock();
    //     // emit MyLog("Supply Rate: (scaled up)", supplyRateMantissa);

    //     // Approve transfer on the ERC20 contract
    //     underlying.approve(_cErc20Contract, _numTokensToSupply);

    //     // Mint cTokens
    //     uint mintResult = cToken.mint(_numTokensToSupply);
    //     return mintResult;
    // }



    function _supply(address cTokenaddress, uint underlyingAmount) internal {
        require(isRegistered[msg.sender], "caller is not registered");
        // _enterMarket(cTokenaddress);
		CTokenInterface cToken = CTokenInterface(cTokenaddress);
		address underlyingAddress = cToken.underlying();
		IERC20(underlyingAddress).approve(cTokenaddress, underlyingAmount);

		uint result = cToken.mint(underlyingAmount);
		require(result == 0, 'cToken#mint() failed. see Compound ErrorReporter.sol');
	}


    // chainlink keeper function call
    function checkUpkeep(bytes calldata) external view override returns(bool upkeep, bytes memory upKeepData)   {

        for(uint256 i = 0; i < users.length; i++ ) {
            User storage user = users[i];
            if(block.timestamp > user.lockTime) {
                bytes memory upKeepData = abi.encode(user);
                bool upKeep = true;
                // performUpkeep(upKeepData);
                // users[i].startTime = block.timestamp;
                return (upKeep, upKeepData);
            }
        }
        // upKeep = true; 
        // upKeepData = "0x";
        // emit Upkeep(msg.sender, upKeep);

    }


    // fallback function for chainlink keepers
    function performUpkeep(bytes calldata upKeepData) external override  {
        (User memory userData) = abi.decode(upKeepData, (User));

        User storage user = pensionServiceApplicant[userData.userAddress];
        if(block.timestamp > user.lockTime) {
            // do something with the user
            require(isRegistered[user.userAddress], "Address not registered");
            require(user.depositedAmount > 0, "Insufficient balance cannot perform upkeep");
            isRegistered[user.userAddress] = false;
            CTokenInterface cToken = CTokenInterface(user.underlyingAsset);

            uint amountToSend = user.depositedAmount;
            address underlyingAsset = cToken.underlying();
            IERC20(underlyingAsset).transfer(user.userAddress, amountToSend);
            user.depositedAmount = 0;

            emit Withdraw(address(this), user.userAddress, amountToSend);
            
            // busd.transferFrom(payable(user.userAddress), address(this), user.amountToSpend);
            // (bool success,) = payable(user.userAddress).transfer(address(this), user.amountToSpend)("");
            // require(success, "Transfer to contract not successful");
            // do something with Xend protocol. or compound finance


            // user.approvedAmountToSpend = user.approvedAmountToSpend - user.amountToSpend;
            // user.depositedAmount = user.depositedAmount + user.amountToSpend;
            // user.startTime = block.timestamp;

            // emit Deposit(user.id, user.userDetails, user.lockTime, user.approvedAmountToSpend);

        }

    }



    function withdraw() public {
        require(isRegistered[msg.sender], "Caller not registered");
        require(pensionServiceApplicant[msg.sender].depositedAmount > 0, "Insufficient Balance");

        // Point to the User in Storage
        User storage user = pensionServiceApplicant[msg.sender];

        if(block.timestamp < user.lockTime) {
            require(user.depositedAmount > 0, "insufficient balance");
            _redeem(user.underlyingAsset, user.depositedAmount);
            isRegistered[msg.sender] = false;
            uint amountToSend = user.depositedAmount.div(2);
            CTokenInterface cToken = CTokenInterface(user.underlyingAsset);
            address underlyingAsset = cToken.underlying();
            IERC20(underlyingAsset).transfer(user.userAddress, amountToSend);
            user.depositedAmount = 0;
            emit Withdraw(address(this), msg.sender, amountToSend);
        } else {
            require(user.depositedAmount > 0, "insufficient balance");
            _redeem(user.underlyingAsset, user.depositedAmount);
            isRegistered[msg.sender] = false;
            uint amountToSend = user.depositedAmount;
            CTokenInterface cToken = CTokenInterface(user.underlyingAsset);
            address underlyingAsset = cToken.underlying();
            IERC20(underlyingAsset).transfer(user.userAddress, amountToSend);
            user.depositedAmount = 0;

            emit Withdraw(address(this), msg.sender, amountToSend);
        }

        // require(block.timestamp > user.lockTime, "Early withdrawal will cost you 50% of your initial deposit");


    }


    function _redeem(address cTokenaddress, uint tokenAmount) internal {
		CTokenInterface cToken = CTokenInterface(cTokenaddress);
		uint result = cToken.redeemUnderlying(tokenAmount);
		require(result == 0, 'cToken#redeem() failed. see Compound ErrorReporter.sol');
	}

    function updateTimeDurationOfDeposit() public {
        User storage user = pensionServiceApplicant[msg.sender];
        user.lockTime = 0;
    } 

    function setLockTime(uint _lockTime) public {
        require(isRegistered[msg.sender], "Caller has to be Registered");
        User storage user = pensionServiceApplicant[msg.sender];
        require(user.lockTime == 0, "Caller already has a lock Time Set");
        user.lockTime = block.timestamp + _lockTime;
    }
}