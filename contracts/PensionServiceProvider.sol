//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import './CTokenInterface.sol';
import './ComptrollerInterface.sol';
import './PriceOracleInterface.sol';
import "./XendFinanceInterface.sol";


// approve the user's underlying asset to be able to use the chainklink keepers

contract PensionServiceProvider is KeeperCompatibleInterface {
    using SafeMath for uint;
    using Counters for Counters.Counter;

    // variables
    ComptrollerInterface public comptroller;
	PriceOracleInterface public priceOracle;
    Counters.Counter private id;

    uint accXendTokens;
    uint256 ccInterest;
    XendFinanceInterface public xendFinance;
    IERC20 public xend;

    uint public lastTimeStamp;
    uint public upKeepInterval;



    



    struct Client {
        address underlyingAsset;
        uint256 depositedAmount;
        uint256 amountToSpend;
        uint256 approvedAmountToSpend;
        uint256 startTime;
        uint256 timeDurationOfdeposit;
        uint256 lockTime;
        string ipfsHashOfUserPensionDetails;
        uint256 userLastRewardBlock;
        bool hasPlan;
    }


    // A user Object
    struct User {
        uint256 id;
        address payable userAddress;
        string  userDetails;
        string  nextOfKinDetails;
        Client client;

    }



    

    


    event Register(address indexed applicant, string indexed applicantDetails);
    event Withdraw(address from, address to, uint amount);
    event Deposit(address user, uint amount);
    event Upkeep(address sender, bool upkeep);
    // event MyLog(string, uint256);
    event Update(uint256 timeDuration);

    mapping(address => User) public pensionServiceApplicant;

    // keep track of registered users
    mapping(address => bool) public isRegistered;

    User[] public users;


    constructor(address _xend, address _xendFinanceIndividual_Yearn_V1,  address _comptroller, address _priceOracle, uint _upKeepInterval)  {
        xend = IERC20(_xend);
        comptroller = ComptrollerInterface(_comptroller);
		priceOracle = PriceOracleInterface(_priceOracle);
        xendFinance = XendFinanceInterface(_xendFinanceIndividual_Yearn_V1);
        ccInterest = uint256(3 ether).div(10); // .3% 
        lastTimeStamp = block.timestamp;
        upKeepInterval = _upKeepInterval;

        id.increment();
        
    }

    function register(
        string memory _userDetails, 
        string memory _NextOfKinDetails
        ) 
        public  {
        require(!isRegistered[msg.sender], "Caller address already exists");

        Client memory client = Client({
            underlyingAsset: address(0),
            depositedAmount: 0,
            amountToSpend: 0,
            approvedAmountToSpend: 0,
            startTime: block.timestamp,
            timeDurationOfdeposit: 0,
            lockTime: 0,
            ipfsHashOfUserPensionDetails: "",
            userLastRewardBlock: block.number,
            hasPlan: false
        });

        User memory user = User({
            id: id.current(),
            userAddress: payable(msg.sender),
            userDetails: _userDetails,
            nextOfKinDetails: _NextOfKinDetails,
            client: client
        });

       

        pensionServiceApplicant[msg.sender] = user;
        users.push(user);
        isRegistered[msg.sender] = true;

        id.increment();

        emit Register(msg.sender, user.userDetails);
    }



    function deposit(uint256 _amount) public payable  {
        require(isRegistered[msg.sender], "Caller is not Registered");
        User storage user = pensionServiceApplicant[msg.sender];
        CTokenInterface cToken = CTokenInterface(user.client.underlyingAsset);
		address underlyingAsset = cToken.underlying();
        IERC20(underlyingAsset).transferFrom(msg.sender, address(this), _amount);
        address cTokenaddress = user.client.underlyingAsset;
        _supply(cTokenaddress, _amount);
        user.client.depositedAmount = user.client.depositedAmount.add(_amount);
        emit Deposit(msg.sender, user.client.depositedAmount);

    }



//     function _enterMarket(address _cTokenaddress) internal {
// 		address[] memory markets = new address[](1);
// 		markets[0] = _cTokenaddress;
// 		uint[] memory results = comptroller.enterMarkets(markets);
// 		require( results[0] == 0, 'comptroller#enterMarkets() failed. see Compound ErrorReporter.sol');
// 	}






    function _supply(address cTokenaddress, uint underlyingAmount) internal {
        // require(isRegistered[msg.sender], "caller is not registered");
        // _enterMarket(cTokenaddress);
		CTokenInterface cToken = CTokenInterface(cTokenaddress);
		address underlyingAddress = cToken.underlying();
		IERC20(underlyingAddress).approve(cTokenaddress, underlyingAmount);

		uint result = cToken.mint(underlyingAmount);
		require(result == 0, 'cToken#mint() failed. see Compound ErrorReporter.sol');
	}


//     // chainlink keeper function call
    function checkUpkeep(bytes calldata /* checkData */) external view override returns(bool upKeepNeeded, bytes memory performData)   {
        upKeepNeeded = (block.timestamp.sub(lastTimeStamp) > upKeepInterval);
        for(uint256 i = 0; i < users.length; i++ ) {
            User storage user = users[i];
            if(block.timestamp.sub(user.client.startTime) > user.client.timeDurationOfdeposit) {
                performData = abi.encode(user);            
                // return (upKeepNeeded, performData);
            }
        }

    }




        function performUpkeep(bytes calldata performData) external override  {
        (User memory userData) = abi.decode(performData, (User));

        User storage user = pensionServiceApplicant[userData.userAddress];
        if(block.timestamp.sub(user.client.startTime) > user.client.timeDurationOfdeposit) {
            // do something with the user's funds
            require(isRegistered[user.userAddress], "Address not registered");
            require(user.client.approvedAmountToSpend > 0, "Insufficient balance cannot perform upkeep");
            require(user.client.hasPlan, "Client has no plan");
            // isRegistered[user.userAddress] = false;
            CTokenInterface cToken = CTokenInterface(user.client.underlyingAsset);

            uint amountToDeposit = user.client.amountToSpend;
            address underlyingAsset = cToken.underlying();
            IERC20(underlyingAsset).transferFrom(user.userAddress, address(this),  amountToDeposit);
            // address cLink = 0xFAce851a4921ce59e912d19329929CE6da6EB0c7;
            _supply(user.client.underlyingAsset, user.client.amountToSpend);
            user.client.depositedAmount = user.client.depositedAmount.add(amountToDeposit);
            user.client.approvedAmountToSpend = user.client.approvedAmountToSpend.sub(user.client.amountToSpend);
            user.client.startTime = block.timestamp;
            user.client.userLastRewardBlock = user.client.userLastRewardBlock.add(block.number);
            ccInterest = ccInterest.mul(block.number).div(1e8);
            lastTimeStamp = block.timestamp;

            emit Deposit(user.userAddress, user.client.amountToSpend);

        }

    }



    function withdraw() public {
        require(isRegistered[msg.sender], "Caller not registered");
        require(pensionServiceApplicant[msg.sender].client.depositedAmount > 0, "Insufficient Balance");
        require(pensionServiceApplicant[msg.sender].client.hasPlan, "Caller has no plan");

        // Point to the User in Storage
        User storage user = pensionServiceApplicant[msg.sender];

        if(block.timestamp < user.client.lockTime) {
            require(user.client.depositedAmount > 0, "insufficient balance");
            _redeem(user.client.underlyingAsset, user.client.depositedAmount);
            // isRegistered[msg.sender] = false;
            uint amountToSend = user.client.depositedAmount.div(2);
            CTokenInterface cToken = CTokenInterface(user.client.underlyingAsset);
            address underlyingAsset = cToken.underlying();
            IERC20(underlyingAsset).transfer(user.userAddress, amountToSend);
            user.client.depositedAmount = 0;
            user.client.userLastRewardBlock = block.number;
            ccInterest = ccInterest.add(block.number).div(1e8);
            emit Withdraw(address(this), msg.sender, amountToSend);
        } else {
            require(user.client.depositedAmount > 0, "insufficient balance");
            _redeem(user.client.underlyingAsset, user.client.depositedAmount);
            // isRegistered[msg.sender] = false;
            uint amountToSend = user.client.depositedAmount;
            CTokenInterface cToken = CTokenInterface(user.client.underlyingAsset);
            address underlyingAsset = cToken.underlying();
            IERC20(underlyingAsset).transfer(user.userAddress, amountToSend);
            user.client.depositedAmount = 0;
            user.client.userLastRewardBlock = block.number;

            emit Withdraw(address(this), msg.sender, amountToSend);
        }

//         // require(block.timestamp > user.lockTime, "Early withdrawal will cost you 50% of your initial deposit");


}


    function _redeem(address cTokenaddress, uint tokenAmount) internal {
		CTokenInterface cToken = CTokenInterface(cTokenaddress);
		uint result = cToken.redeemUnderlying(tokenAmount);
		require(result == 0, 'cToken#redeem() failed. see Compound ErrorReporter.sol');
	}

    // helper function for testing keepers
    function updateTimeDurationOfDeposit() public  {
        User storage user = pensionServiceApplicant[msg.sender];
        require(isRegistered[user.userAddress], "Caller is not registered");
        user.client.timeDurationOfdeposit = 5;
        emit Update(user.client.timeDurationOfdeposit);
    } 

    function setPlan(address _underlyingAsset, string memory _ipfsHashOfUserPensionDetails, uint _approvedAmountToSpend, uint _amountToSpend, uint _timeDurationOfDeposit, uint _lockTime) public {
        require(_approvedAmountToSpend > _amountToSpend, "Set an amount greater than the recurring amount");
        require(_amountToSpend > 0, "approve an amount greater than 0");
        require(isRegistered[msg.sender], "Caller has to be Registered");
        User storage user = pensionServiceApplicant[msg.sender];
        require(user.client.lockTime == 0, "Caller already has a lock Time Set");
        user.client.underlyingAsset = _underlyingAsset;
        user.client.lockTime = block.timestamp + _lockTime;
        user.client.timeDurationOfdeposit = block.timestamp.add(_timeDurationOfDeposit);
        user.client.ipfsHashOfUserPensionDetails = _ipfsHashOfUserPensionDetails;
        user.client.approvedAmountToSpend = _approvedAmountToSpend;
        user.client.amountToSpend = _amountToSpend;
        user.client.hasPlan = true;
    }



//     // for Xend

    function getXendPendingRewards(address _user) public view returns(uint) {
        User storage user = pensionServiceApplicant[_user];
        uint256 accXendRewards = xendFinance.GetMemberXendTokenReward(address(this));
        uint256 userPendingRewards = user.client.depositedAmount.mul(accXendRewards).div(1e8);

        return userPendingRewards;
    }



    function depositToXendFinance(uint _amount) public  {
        // require(isRegistered[msg.sender], "Caller not Registered");
        User storage user = pensionServiceApplicant[msg.sender];
        xendFinance.deposit();
        user.client.depositedAmount = user.client.depositedAmount.add(_amount);

        emit Deposit(msg.sender, user.client.depositedAmount);
        
    }



    function withdrawFromXendFinance() public {
        require(isRegistered[msg.sender], "Caller not Registered");
        User storage user = pensionServiceApplicant[msg.sender];
        xendFinance.withdraw(user.client.depositedAmount);
        uint256 xendBalance = xend.balanceOf(address(this));
        require(xendBalance > user.client.depositedAmount, "Withdrawing more than you deposited");
        accXendTokens = xendBalance;
        uint256 accXendTokensforUser = user.client.depositedAmount.mul(accXendTokens).div(1e8);
        xend.transfer(msg.sender, accXendTokensforUser);

    }

    function getAccruedInterest() public view returns(uint) {
        User storage user = pensionServiceApplicant[msg.sender];
        require(isRegistered[user.userAddress], "Caller not registered");
        CTokenInterface ctoken = CTokenInterface(user.client.underlyingAsset);
        uint supplyRatePerBlock = ctoken.supplyRatePerBlock();
        uint accInterest = user.client.depositedAmount.mul(supplyRatePerBlock).div(ccInterest).div(1e8);
        return accInterest;
    }
}