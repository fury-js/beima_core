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

contract PensionServiceProvider is KeeperCompatibleInterface, Pausable, ReentrancyGuard, Ownable {
    using SafeMath for uint;
    using Counters for Counters.Counter;

    // variables
    ComptrollerInterface public comptroller;
	PriceOracleInterface public priceOracle;
    Counters.Counter private id;

    uint accXendTokens;
    XendFinanceInterface public xendFinance;
    IERC20 public xend;


    



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
    event Update(uint256 timeDuration);

    mapping(address => User) public pensionServiceApplicant;

    // keep track of registered users
    mapping(address => bool) public isRegistered;

    User[] public users;


    constructor(address _xend, address _xendFinanceIndividual_Yearn_V1,  address _comptroller, address _priceOracle )  {
        xend = IERC20(_xend);
        comptroller = ComptrollerInterface(_comptroller);
		priceOracle = PriceOracleInterface(_priceOracle);
        xendFinance = XendFinanceInterface(_xendFinanceIndividual_Yearn_V1);

        id.increment();
        
    }

    function register(
        address _underlyingAsset,
        string memory _userDetails, 
        uint256 _amountToSpend,
        uint256 _approvedAmountToSpend,
        uint256 _timeDurationOfDeposit
        ) 
        public whenNotPaused() {
        require(!isRegistered[msg.sender], "Caller address already exists");

        User memory user = User({
            id: id.current(),
            userAddress: payable(msg.sender),
            underlyingAsset: _underlyingAsset,
            userDetails: _userDetails,
            depositedAmount: 0,
            amountToSpend: _amountToSpend,
            approvedAmountToSpend: _approvedAmountToSpend,
            startTime: block.timestamp,
            timeDurationOfdeposit: _timeDurationOfDeposit,
            lockTime: 0
        });

        pensionServiceApplicant[msg.sender] = user;
        users.push(user);
        isRegistered[msg.sender] = true;

        id.increment();

        emit Register(msg.sender, user.userDetails, user.amountToSpend, user.lockTime);
    }



    function deposit(uint256 _amount) public payable whenNotPaused() {
        require(isRegistered[msg.sender], "Caller is not Registered");
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






    function _supply(address cTokenaddress, uint underlyingAmount) internal {
        // require(isRegistered[msg.sender], "caller is not registered");
        // _enterMarket(cTokenaddress);
		CTokenInterface cToken = CTokenInterface(cTokenaddress);
		address underlyingAddress = cToken.underlying();
		IERC20(underlyingAddress).approve(cTokenaddress, underlyingAmount);

		uint result = cToken.mint(underlyingAmount);
		require(result == 0, 'cToken#mint() failed. see Compound ErrorReporter.sol');
	}


    // chainlink keeper function call
    function checkUpkeep(bytes calldata) external view override whenNotPaused() returns(bool upkeep, bytes memory upKeepData)   {

        for(uint256 i = 0; i < users.length; i++ ) {
            User storage user = users[i];
            if(block.timestamp > user.timeDurationOfdeposit) {
                bytes memory Data = abi.encode(user);
                bool upKeep = true;
                // performUpkeep(upKeepData);
                // users[i].startTime = block.timestamp;
                return (upKeep, Data);
            }
        }

    }


    // fallback function for chainlink keepers
    // function performUpkeep(bytes calldata upKeepData) external override whenNotPaused()  {
    //     (User memory userData) = abi.decode(upKeepData, (User));

    //     User storage user = pensionServiceApplicant[userData.userAddress];
    //     if(block.timestamp > user.lockTime) {
    //         // do something with the user
    //         require(isRegistered[user.userAddress], "Address not registered");
    //         require(user.depositedAmount > 0, "Insufficient balance cannot perform upkeep");
    //         isRegistered[user.userAddress] = false;
    //         CTokenInterface cToken = CTokenInterface(user.underlyingAsset);

    //         uint amountToSend = user.depositedAmount;
    //         address underlyingAsset = cToken.underlying();
    //         IERC20(underlyingAsset).transfer(user.userAddress, amountToSend);
    //         user.depositedAmount = 0;

    //         emit Withdraw(address(this), user.userAddress, amountToSend);
            
    //         // busd.transferFrom(payable(user.userAddress), address(this), user.amountToSpend);
    //         // (bool success,) = payable(user.userAddress).transfer(address(this), user.amountToSpend)("");
    //         // require(success, "Transfer to contract not successful");
    //         // do something with Xend protocol. or compound finance


    //         // user.approvedAmountToSpend = user.approvedAmountToSpend - user.amountToSpend;
    //         // user.depositedAmount = user.depositedAmount + user.amountToSpend;
    //         // user.startTime = block.timestamp;

    //         // emit Deposit(user.id, user.userDetails, user.lockTime, user.approvedAmountToSpend);

    //     }

    // }

        function performUpkeep(bytes calldata upKeepData) external override whenNotPaused()  {
        (User memory userData) = abi.decode(upKeepData, (User));

        User storage user = pensionServiceApplicant[userData.userAddress];
        if(block.timestamp.add(user.startTime) > user.timeDurationOfdeposit) {
            // do something with the user
            require(isRegistered[user.userAddress], "Address not registered");
            require(user.approvedAmountToSpend > 0, "Insufficient balance cannot perform upkeep");
            // isRegistered[user.userAddress] = false;
            CTokenInterface cToken = CTokenInterface(user.underlyingAsset);

            uint amountToDeposit = user.amountToSpend;
            address underlyingAsset = cToken.underlying();
            IERC20(underlyingAsset).transferFrom(user.userAddress, address(this),  amountToDeposit);
            // address cLink = 0xFAce851a4921ce59e912d19329929CE6da6EB0c7;
            _supply(user.underlyingAsset, user.amountToSpend);
            user.depositedAmount = user.depositedAmount.add(amountToDeposit);
            user.approvedAmountToSpend = user.approvedAmountToSpend.sub(user.amountToSpend);
            user.startTime = block.timestamp;

            emit Deposit(user.userAddress, user.amountToSpend);


            // emit Withdraw(address(this), user.userAddress, amountToSend);
            
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



    function withdraw() public whenNotPaused() nonReentrant() {
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

    // helper function for testing keepers
    function updateTimeDurationOfDeposit() public  {
        User storage user = pensionServiceApplicant[msg.sender];
        require(isRegistered[user.userAddress], "Caller is not registered");
        user.timeDurationOfdeposit = 0;
        emit Update(user.timeDurationOfdeposit);
    } 

    function setLockTime(uint _lockTime) public {
        require(isRegistered[msg.sender], "Caller has to be Registered");
        User storage user = pensionServiceApplicant[msg.sender];
        require(user.lockTime == 0, "Caller already has a lock Time Set");
        user.lockTime = block.timestamp + _lockTime;
    }



    // for Xend

    function getXendPendingRewards(address _user) public view returns(uint) {
        User storage user = pensionServiceApplicant[_user];
        uint256 accXendRewards = xendFinance.GetMemberXendTokenReward(address(this));
        uint256 userPendingRewards = user.depositedAmount.mul(accXendRewards).div(1e8);

        return userPendingRewards;
    }



    function depositToXendFinance(uint _amount) public whenNotPaused() {
        // require(isRegistered[msg.sender], "Caller not Registered");
        User storage user = pensionServiceApplicant[msg.sender];
        xendFinance.deposit();
        user.depositedAmount = user.depositedAmount.add(_amount);

        emit Deposit(msg.sender, user.depositedAmount);
        
    }



    function withdrawFromXendFinance() public whenNotPaused() nonReentrant() {
        require(isRegistered[msg.sender], "Caller not Registered");
        User storage user = pensionServiceApplicant[msg.sender];
        xendFinance.withdraw(user.depositedAmount);
        uint256 xendBalance = xend.balanceOf(address(this));
        require(xendBalance > user.depositedAmount, "Withdrawing more than you deposited");
        accXendTokens = xendBalance;
        uint256 accXendTokensforUser = user.depositedAmount.mul(accXendTokens).div(1e8);
        xend.transfer(msg.sender, accXendTokensforUser);

    }
}