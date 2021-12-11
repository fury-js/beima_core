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

contract PensionServiceProvider is ReentrancyGuard, Pausable, Ownable {
    using SafeMath for uint;
    using Counters for Counters.Counter;

    // variables
    ComptrollerInterface public comptroller;
	PriceOracleInterface public priceOracle;
    Counters.Counter private id;
    uint balance;

    uint accXendTokens;
    uint256 ccInterest;
    XendFinanceInterface public xendFinance;
    IERC20 public xend;
    IERC20 public busd;

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
        Client client;

    }



    

    


    event Register(address indexed applicant, string indexed applicantDetails);
    event Withdraw(address from, address to, uint amount);
    event Deposit(address indexed sender, address receiver, uint indexed amountSpent);
    event Upkeep(address sender, bool upkeep);
    event Plan(address user, string planDetails, uint lockTime);
    event Update(uint256 timeDuration);
    event Transfer(address indexed sender, uint amount, address indexed receiver);
    event MyLog(string, uint256);

    mapping(address => User) public pensionServiceApplicant;
    address constant ETHER = address(0); // Stores ether in the tokens mapping
	mapping(address => mapping(address => uint256)) public assets;

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


    receive() external payable {
        balance = msg.value;
    }

    function register(
        string memory _userDetails
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
            client: client
        });

       

        pensionServiceApplicant[msg.sender] = user;
        users.push(user);
        isRegistered[msg.sender] = true;

        id.increment();

        emit Register(msg.sender, _userDetails);
    }



    // function depositToBeima(address _asset ,uint256 _amount) external payable nonReentrant()  {
    //     IERC20(_asset).transfer(address(this), _amount);
    //     require(isRegistered[msg.sender], "Caller is not Registered");
    //     // require(_amount > 0, "Amount cannot be 0");
    //     User storage user = pensionServiceApplicant[msg.sender];
    //     // require(IERC20(cToken.underlying()).balanceOf(address(this)) >= _amount, "Transfer failed");
    //     user.client.depositedAmount = user.client.depositedAmount.add(_amount);
    //     user.client.approvedAmountToSpend = user.client.approvedAmountToSpend.sub(user.client.amountToSpend);
    //     user.client.startTime = block.timestamp;
    //     user.client.userLastRewardBlock = user.client.userLastRewardBlock.add(block.number);
    //     lastTimeStamp = block.timestamp;
    //     // _supply(_asset, _amount);
    //     emit Deposit(address(this), _asset, _amount);

    // }

    function depositToken (address _asset, uint _amount)public{
		require(_asset != ETHER);
		require(IERC20(_asset).transferFrom(msg.sender, address(this), _amount));
		assets[_asset][msg.sender] = assets[_asset][msg.sender].add(_amount);
		emit Deposit (msg.sender, _asset, assets[_asset][msg.sender]);
	}



//     function _enterMarket(address _cTokenaddress) internal {
// 		address[] memory markets = new address[](1);
// 		markets[0] = _cTokenaddress;
// 		uint[] memory results = comptroller.enterMarkets(markets);
// 		require( results[0] == 0, 'comptroller#enterMarkets() failed. see Compound ErrorReporter.sol');
// 	}






    function supply(address cTokenaddress, uint underlyingAmount) public returns(uint) {
        require(underlyingAmount > 0, "Amount Cannot be 0");
        // _enterMarket(cTokenaddress);
		CTokenInterface cToken = CTokenInterface(cTokenaddress);
		address underlyingAddress = cToken.underlying();
		IERC20(underlyingAddress).approve(cTokenaddress, underlyingAmount);

		uint result = cToken.mint(underlyingAmount);
		require(result == 0, 'cToken#mint() failed. see Compound ErrorReporter.sol');
        return result;
	}


//     // chainlink keeper function call
    // function checkUpkeep(bytes calldata /* checkData */) external view override returns(bool, bytes memory)   {
        
    //     return (block.timestamp.sub(lastTimeStamp) > upKeepInterval, bytes(abi.encode(users)));
    //     // (block.timestamp.sub(lastTimeStamp) > upKeepInterval);
        
    // }




    // function performUpkeep(bytes calldata performData ) external override  {
    //     // User[] memory usersArray = abi.decode(performData, (User[]));
    //     // for(uint256 i = 0; i < usersArray.length - 1; i++ ) {
    //             User memory  user = pensionServiceApplicant[msg.sender];
    //             require(isRegistered[user.userAddress], "Address not registered");
    //             require(user.client.approvedAmountToSpend > 0, "Insufficient balance cannot perform upkeep");
    //             require(user.client.hasPlan, "Client has no plan");
    //              CTokenInterface cToken = CTokenInterface(user.client.underlyingAsset);

    //             uint amountToDeposit = user.client.amountToSpend;
    //             address underlyingAsset = cToken.underlying();
    //             user.client.depositedAmount = user.client.depositedAmount.add(amountToDeposit);
    //             IERC20(underlyingAsset).transferFrom(user.userAddress, address(this),  amountToDeposit);
    //             uint balance = IERC20(underlyingAsset).balanceOf(address(this));
    //             require(balance == amountToDeposit, "Transfer failed");
    //             _deposit(user.client.underlyingAsset, balance);
    //             // address cLink = 0xFAce851a4921ce59e912d19329929CE6da6EB0c7;
    //             // emit Transfer(user.userAddress, user.client.depositedAmount, address(this));
    //             // _supply(user.client.underlyingAsset, user.client.amountToSpend);
    //             user.client.depositedAmount = user.client.depositedAmount.add(amountToDeposit);
    //             user.client.approvedAmountToSpend = user.client.approvedAmountToSpend.sub(user.client.amountToSpend);
    //             user.client.startTime = block.timestamp;
    //             user.client.userLastRewardBlock = user.client.userLastRewardBlock.add(block.number);
    //             ccInterest = ccInterest.mul(block.number);
    //             lastTimeStamp = block.timestamp;

    //             emit Deposit(user.userAddress, address(this), user.client.depositedAmount);
    //     // }
            
    //     // emit Update(pensionServiceApplicant[msg.sender].depositedAmount);

    // }



    function withdraw() public nonReentrant() {
        require(isRegistered[msg.sender], "Caller not registered");
        User storage user = pensionServiceApplicant[msg.sender];
        uint amountToSend = user.client.depositedAmount;
        CTokenInterface cToken = CTokenInterface(user.client.underlyingAsset);
        address underlyingAsset = cToken.underlying();
        IERC20(underlyingAsset).transfer(msg.sender, amountToSend);
        user.client.depositedAmount = 0;
        user.client.userLastRewardBlock = block.number;
        ccInterest = ccInterest.add(block.number).div(1e8);
        emit Withdraw(address(this), msg.sender, amountToSend);


    }


    function redeemCErc20Tokens(
        uint256 amount,
        bool redeemType,
        address _cErc20Contract
    ) public returns (bool) {
        // Create a reference to the corresponding cToken contract, like cDAI
        CTokenInterface cToken = CTokenInterface(_cErc20Contract);

        // `amount` is scaled up, see decimal table here:
        // https://compound.finance/docs#protocol-math

        uint256 redeemResult;

        if (redeemType == true) {
            // Retrieve your asset based on a cToken amount
            redeemResult = cToken.redeem(amount);
        } else {
            // Retrieve your asset based on an amount of the asset
            redeemResult = cToken.redeemUnderlying(amount);
        }

        // Error codes are listed here:
        // https://compound.finance/docs/ctokens#error-codes
        emit MyLog("If this is not 0, there was an error", redeemResult);

        return true;
    }

    // helper function for testing keepers
    function updateTimeDurationOfDeposit() public onlyOwner()  {
        User memory user = pensionServiceApplicant[msg.sender];
        require(isRegistered[user.userAddress], "Caller is not registered");
        user.client.timeDurationOfdeposit = 0;
        emit Update(user.client.timeDurationOfdeposit);
    } 

    function setPlan(
        address _underlyingAsset, 
        string memory _ipfsHashOfUserPensionDetails, 
        uint _approvedAmountToSpend, 
        uint _amountToSpend, 
        uint _timeDurationOfDeposit, 
        uint _lockTime) 
        public {
        require(_approvedAmountToSpend > _amountToSpend, "Set an amount greater than the recurring amount");
        require(_amountToSpend > 0, "approve an amount greater than 0");
        require(isRegistered[msg.sender], "Caller has to be Registered");
        User storage user = pensionServiceApplicant[msg.sender];
        require(user.client.lockTime == 0, "Caller already has a lock Time Set");
        user.client.underlyingAsset = _underlyingAsset;
        user.client.lockTime = _lockTime;
        user.client.timeDurationOfdeposit = block.timestamp.add(_timeDurationOfDeposit);
        user.client.ipfsHashOfUserPensionDetails = _ipfsHashOfUserPensionDetails;
        user.client.approvedAmountToSpend = _approvedAmountToSpend;
        user.client.amountToSpend = _amountToSpend;
        user.client.hasPlan = true;

        emit Plan(msg.sender, user.client.ipfsHashOfUserPensionDetails, user.client.lockTime);
    }



//     // for Xend

    function getXendPendingRewards(address _user) public view returns(uint) {
        User memory user = pensionServiceApplicant[_user];
        uint256 accXendRewards = xendFinance.GetMemberXendTokenReward(address(this));
        uint256 userPendingRewards = user.client.depositedAmount.mul(accXendRewards).div(1e8);

        return userPendingRewards;
    }



    function depositToXendFinance(uint _amount) public  {
        // require(isRegistered[msg.sender], "Caller not Registered");
        User storage user = pensionServiceApplicant[msg.sender];
        busd.transferFrom(msg.sender, address(this), _amount);
        busd.approve(address(xendFinance), _amount);
        xendFinance.deposit();
        user.client.depositedAmount = user.client.depositedAmount.add(_amount);

        emit Deposit(msg.sender, address(xend), user.client.depositedAmount);
        
    }



    function withdrawFromXendFinance() public nonReentrant() {
        require(isRegistered[msg.sender], "Caller not Registered");
        User memory user = pensionServiceApplicant[msg.sender];
        xendFinance.withdraw(user.client.depositedAmount);
        uint256 xendBalance = xend.balanceOf(address(this));
        require(xendBalance > user.client.depositedAmount, "Withdrawing more than you deposited");
        accXendTokens = xendBalance;
        uint256 accXendTokensforUser = user.client.depositedAmount.mul(accXendTokens).div(1e8);
        xend.transfer(msg.sender, accXendTokensforUser);

    }

    function getAccruedInterest() public view returns(uint) {
        User memory user = pensionServiceApplicant[msg.sender];
        require(isRegistered[user.userAddress], "Caller not registered");
        CTokenInterface ctoken = CTokenInterface(user.client.underlyingAsset);
        uint supplyRatePerBlock = ctoken.supplyRatePerBlock();
        uint accInterest = user.client.depositedAmount.mul(supplyRatePerBlock).div(ccInterest).div(1e8);
        return accInterest;
    }
}