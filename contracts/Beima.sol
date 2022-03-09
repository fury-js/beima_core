//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./CTokenInterface.sol";
import "./ComptrollerInterface.sol";
import "./PriceOracleInterface.sol";
import "./XendFinanceInterface.sol";
import "./MasterPool.sol";
import "./BeimaToken.sol";

contract Beima is ReentrancyGuard, Pausable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    // variables
    ComptrollerInterface public comptroller;
    PriceOracleInterface public priceOracle;
    Counters.Counter private id;
    uint256 balance;

    uint256 accXendTokens;
    uint256 ccInterest;
    XendFinanceInterface public xendFinance;
    IERC20 public xend;
    IERC20 public busd;
    BeimaToken public beimaToken;  
    address public admin;

    uint256 public lastTimeStamp;
    uint256 public upKeepInterval;
    uint256 public beimaTokenPerBlock = uint256(1 ether).div(100); //0.1
    uint256 public totalAllocPoint = 100;

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

    struct PoolInfo {
        uint256 allocPoint;
        uint256 lastRewardBlock;
        uint256 accbeimaPerShare;
        uint256 depositedAmount;
        uint256 rewardsAmount;
        uint256 lockupDuration;
    }

    // A user Object
    struct User {
        uint256 id;
        address payable userAddress;
        string userDetails;
        Client client;
        uint256 rewardDebt;
        uint256 pendingRewards;
        uint256 lastClaim;
    }

    event Register(address indexed applicant, string indexed applicantDetails);
    event Withdraw(address from, address to, uint256 amount);
    event Deposit(
        address indexed sender,
        address receiver,
        uint256 indexed amountSpent
    );
    event Upkeep(address sender, bool upkeep);
    event Plan(address user, string planDetails, uint256 lockTime);
    event Update(uint256 timeDuration);
    event Transfer(
        address indexed sender,
        uint256 amount,
        address indexed receiver
    );
    event Supply(address sender, uint256 amount);
    event Redeem(string, uint256);
    event Claim(address indexed user, uint256 indexed pid, uint256 amount);

    mapping(address => User) public pensionServiceApplicant;
    address constant ETHER = address(0); // Stores ether in the tokens mapping
    mapping(address => mapping(address => uint256)) public assets;
    mapping(address => uint256) public unsuppliedAmount;
    mapping(address => uint256) public stakedBalance;

    // keep track of registered users
    mapping(address => bool) public isRegistered;
    mapping(address => bool) public hasRedeemed;

    User[] public users;
    PoolInfo[] public poolInfo;

    constructor(
        address _xend,
        address _xendFinanceIndividual_Yearn_V1,
        address _comptroller,
        address _priceOracle,
        uint256 _upKeepInterval
    ) {
        xend = IERC20(_xend);
        comptroller = ComptrollerInterface(_comptroller);
        priceOracle = PriceOracleInterface(_priceOracle);
        xendFinance = XendFinanceInterface(_xendFinanceIndividual_Yearn_V1);
        ccInterest = uint256(3 ether).div(10); // .3%
        lastTimeStamp = block.timestamp;
        upKeepInterval = _upKeepInterval;
        admin = msg.sender;

        id.increment();
    }

    receive() external payable {
        balance = msg.value;
    }

    function addPool(uint256 _allocPoint, uint256 _lockupDuration) internal {
        poolInfo.push(
            PoolInfo({
                allocPoint: _allocPoint,
                lastRewardBlock: 0,
                accbeimaPerShare: 0,
                depositedAmount: 0,
                rewardsAmount: 0,
                lockupDuration: _lockupDuration
            })
        );
    }



    function startPool(uint256 _allocPoint, uint256 _lockupDuration) external onlyOwner {
        addPool(_allocPoint, _lockupDuration); //10% staking pool
    }



    function initializePool(uint256 pid, uint256 startBlock) external onlyOwner {
        require(poolInfo[pid].lastRewardBlock == 0, "Staking already started");
        poolInfo[pid].lastRewardBlock = startBlock;
    }

    function register(string memory _userDetails) public {
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
            client: client,
            rewardDebt: 0,
            pendingRewards: 0,
            lastClaim: block.timestamp
        });

        pensionServiceApplicant[msg.sender] = user;
        users.push(user);
        isRegistered[msg.sender] = true;

        id.increment();

        emit Register(msg.sender, _userDetails);
    }

    function updatePool(uint256 pid) internal {
        require(
            poolInfo[pid].lastRewardBlock > 0 &&
                block.number >= poolInfo[pid].lastRewardBlock,
            "Staking not yet started"
        );
        PoolInfo storage pool = poolInfo[pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 depositedAmount = pool.depositedAmount;
        if (pool.depositedAmount == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = block.number.sub(pool.lastRewardBlock);
        uint256 beimaTokenReward = multiplier
            .mul(beimaTokenPerBlock)
            .mul(pool.allocPoint)
            .div(totalAllocPoint);
        pool.rewardsAmount = pool.rewardsAmount.add(beimaTokenReward);
        pool.accbeimaPerShare = pool.accbeimaPerShare.add(
            beimaTokenReward.mul(1e8).div(depositedAmount)
        );
        pool.lastRewardBlock = block.number;
    }

    function depositToken(
        uint256 pid,
        address _asset,
        uint256 _amount
    ) public {
        PoolInfo storage pool = poolInfo[pid];
        require(pool.lastRewardBlock != 0, "Staking Pool has not been initialize");
        User storage user = pensionServiceApplicant[msg.sender];
        updatePool(pid);
        require(
            user.client.approvedAmountToSpend >= user.client.amountToSpend,
            "You have execeeded the approved amount for this plan, please make another plan"
        );
        require(isRegistered[msg.sender], "Caller not registered");
        require(user.client.hasPlan, "Caller has no plan");
        require(_asset != ETHER, "Address is invalid");
        require(
            IERC20(_asset).transferFrom(msg.sender, address(this), _amount),
            "Deposit has failed"
        );
        assets[_asset][msg.sender] = assets[_asset][msg.sender].add(_amount);
        unsuppliedAmount[msg.sender] = unsuppliedAmount[msg.sender].add(
            _amount
        );
        pool.depositedAmount = pool.depositedAmount.add(_amount);
        user.client.approvedAmountToSpend = user
            .client
            .approvedAmountToSpend
            .sub(_amount);
        user.rewardDebt = user.client.depositedAmount.mul(pool.accbeimaPerShare).div(1e8);
        user.lastClaim = block.timestamp;
        emit Deposit(msg.sender, address(this), assets[_asset][msg.sender]);
    }

    function withdrawToken(uint256 pid, address _asset) public nonReentrant whenNotPaused {
        PoolInfo storage pool = poolInfo[pid];
        require(pool.lastRewardBlock != 0, "Pool is currently Inactive");
        require(
            assets[_asset][msg.sender] > 0,
            "You have no funds available to withdraw"
        );
        require(_asset != ETHER);
        User storage user = pensionServiceApplicant[msg.sender];
        require(
            block.timestamp > user.client.lockTime,
            "Unable to withdraw before your locktime expires"
        );
        // uint interestAccrued =
        // uint amountToSend = assets[_asset][msg.sender];
        if (unsuppliedAmount[msg.sender] > 0) {
            require(
                IERC20(_asset).transfer(
                    msg.sender,
                    unsuppliedAmount[msg.sender]
                )
            );
            uint256 amountToSend = assets[_asset][msg.sender].sub(
                unsuppliedAmount[msg.sender]
            );
            unsuppliedAmount[msg.sender] = unsuppliedAmount[msg.sender].sub(
                unsuppliedAmount[msg.sender]
            );
            assets[_asset][msg.sender] = assets[_asset][msg.sender].sub(
                assets[_asset][msg.sender]
            );
            require(IERC20(_asset).transfer(msg.sender, amountToSend));
            user.client.hasPlan = false;
            user.client.lockTime = 0;
            emit Withdraw(address(this), msg.sender, amountToSend);
        } else {
            require(
                IERC20(_asset).transfer(msg.sender, assets[_asset][msg.sender])
            );
            user.client.hasPlan = false;
            user.client.lockTime = 0;
            emit Withdraw(
                address(this),
                msg.sender,
                assets[_asset][msg.sender]
            );
        } 
    }

    function forcedWithdraw(address _asset) public {
        // require(hasRedeemed[msg.sender], "Funds need to be redeemed before withdraw");
        require(
            assets[_asset][msg.sender] >= 0,
            "You cannot withdraw 0 amount"
        );
        require(_asset != ETHER);
        User storage user = pensionServiceApplicant[msg.sender];

        uint256 penalty = assets[_asset][msg.sender].div(100).mul(20);
        assets[_asset][address(this)] = assets[_asset][address(this)].add(
            penalty
        );
        uint256 amountToSend;
        if (unsuppliedAmount[msg.sender] > 0) {
            amountToSend = assets[_asset][msg.sender].sub(penalty).add(
                unsuppliedAmount[msg.sender]
            );
            unsuppliedAmount[msg.sender] = unsuppliedAmount[msg.sender].sub(
                unsuppliedAmount[msg.sender]
            );
            assets[_asset][msg.sender] = assets[_asset][msg.sender].sub(
                assets[_asset][msg.sender]
            );
            require(IERC20(_asset).transfer(msg.sender, amountToSend));
            user.client.hasPlan = false;
            user.client.lockTime = 0;
            emit Withdraw(address(this), msg.sender, amountToSend);
        } else {
            amountToSend = assets[_asset][msg.sender].sub(penalty);
            assets[_asset][msg.sender] = assets[_asset][msg.sender].sub(
                assets[_asset][msg.sender]
            );
            require(IERC20(_asset).transfer(msg.sender, amountToSend));
            user.client.hasPlan = false;
            user.client.lockTime = 0;
            emit Withdraw(address(this), msg.sender, amountToSend);
        }
    }

    // function supply(address cTokenaddress) public returns (uint256) {
    //     require(isRegistered[msg.sender], "Caller not registered");
    //     require(unsuppliedAmount[msg.sender] > 0, "Amount cannot be 0");
    //     CTokenInterface cToken = CTokenInterface(cTokenaddress);
    //     address underlyingAddress = cToken.underlying();
    //     IERC20(underlyingAddress).approve(
    //         cTokenaddress,
    //         unsuppliedAmount[msg.sender]
    //     );

    //     uint256 result = cToken.mint(unsuppliedAmount[msg.sender]);
    //     stakedBalance[msg.sender] = stakedBalance[msg.sender].add(
    //         unsuppliedAmount[msg.sender]
    //     );
    //     unsuppliedAmount[msg.sender] = unsuppliedAmount[msg.sender].sub(
    //         unsuppliedAmount[msg.sender]
    //     );
    //     require(
    //         result == 0,
    //         "cToken#mint() failed. see Compound ErrorReporter.sol"
    //     );
    //     emit Supply(msg.sender, stakedBalance[msg.sender]);
    //     return result;
    // }

    // function redeemCErc20Tokens(address _cErc20Contract)
    //     public
    //     nonReentrant
    //     returns (bool)
    // {
    //     require(isRegistered[msg.sender], "Caller not registered");
    //     require(stakedBalance[msg.sender] > 0, "Caller has not supplied funds");
    //     User memory user = pensionServiceApplicant[msg.sender];
    //     require(
    //         block.timestamp > user.client.lockTime,
    //         "Unable to withdraw before your locktime expires"
    //     );

    //     CTokenInterface cToken = CTokenInterface(_cErc20Contract);
    //     uint256 redeemResult;

    //     redeemResult = cToken.redeemUnderlying(stakedBalance[msg.sender]);
    //     hasRedeemed[msg.sender] = true;
    //     stakedBalance[msg.sender] = stakedBalance[msg.sender].sub(
    //         stakedBalance[msg.sender]
    //     );

    //     emit Redeem("If this is not 0, there was an error", redeemResult);

    //     return true;
    // }

    function setPlan(
        address _underlyingAsset,
        string memory _ipfsHashOfUserPensionDetails,
        uint256 _approvedAmountToSpend,
        uint256 _amountToSpend,
        uint256 _timeDurationOfDeposit,
        uint256 _lockTime
    ) public {
        require(
            _approvedAmountToSpend > _amountToSpend,
            "Set an amount greater than the recurring amount"
        );
        require(_amountToSpend > 0, "approve an amount greater than 0");
        require(isRegistered[msg.sender], "Caller has to be Registered");
        User storage user = pensionServiceApplicant[msg.sender];
        require(
            user.client.lockTime == 0,
            "Caller already has a lock Time Set"
        );
        user.client.underlyingAsset = _underlyingAsset;
        user.client.lockTime = block.timestamp.add(_lockTime);
        user.client.timeDurationOfdeposit = block.timestamp.add(
            _timeDurationOfDeposit
        );
        user
            .client
            .ipfsHashOfUserPensionDetails = _ipfsHashOfUserPensionDetails;
        user.client.approvedAmountToSpend = _approvedAmountToSpend;
        user.client.amountToSpend = _amountToSpend;
        user.client.hasPlan = true;

        emit Plan(
            msg.sender,
            user.client.ipfsHashOfUserPensionDetails,
            user.client.lockTime
        );
    }

    function getAssetAddress(address ctokenAddress)
        public
        view
        returns (address)
    {
        CTokenInterface cToken = CTokenInterface(ctokenAddress);
        return cToken.underlying();
    }

    function pendingRewards(uint256 pid, address _user) external view returns (uint256) {
        require(poolInfo[pid].lastRewardBlock > 0 && block.number >= poolInfo[pid].lastRewardBlock, 'Staking not yet started');
        PoolInfo storage pool = poolInfo[pid];
        User storage user = pensionServiceApplicant[msg.sender];
        uint256 accbeimaPerShare = pool.accbeimaPerShare;
        uint256 depositedAmount = pool.depositedAmount;
        if (block.number > pool.lastRewardBlock && depositedAmount != 0) {
            uint256 multiplier = block.number.sub(pool.lastRewardBlock);
            uint256 beimaTokenReward = multiplier.mul(beimaTokenPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
            accbeimaPerShare = accbeimaPerShare.add(beimaTokenReward.mul(1e8).div(depositedAmount));
        }
        return user.client.depositedAmount.mul(accbeimaPerShare).div(1e8).sub(user.rewardDebt).add(user.pendingRewards);
    }

    function withdrawPenalty(address _asset) public onlyOwner {
        require(assets[_asset][address(this)] > 0, "Cannot withdraw 0 amount");
        require(IERC20(_asset).transfer(admin, assets[_asset][address(this)]));
    }

    // helper function to be deleted on migration to mainet
    function updateLockTime() public {
        require(isRegistered[msg.sender], "caller is not registered");
        User storage user = pensionServiceApplicant[msg.sender];
        user.client.lockTime = 0;
    }

    function endPool(uint256 pid) external onlyOwner {
        PoolInfo storage pool = poolInfo[pid];
        pool.lastRewardBlock = 0;

    }

    
    function claim(uint256 pid) public {
        PoolInfo storage pool = poolInfo[pid];
        User storage user = pensionServiceApplicant[msg.sender];
        updatePool(pid);
        uint256 pending = user.client.depositedAmount.mul(pool.accbeimaPerShare).div(1e8).sub(user.rewardDebt);
        if (pending > 0 || user.pendingRewards > 0) {
            user.pendingRewards = user.pendingRewards.add(pending);
            uint256 claimedAmount = safebeimaTokenTransfer(msg.sender, user.pendingRewards, pid);
            emit Claim(msg.sender, pid, claimedAmount);
            user.pendingRewards = user.pendingRewards.sub(claimedAmount);
            user.lastClaim = block.timestamp;
            pool.rewardsAmount = pool.rewardsAmount.sub(claimedAmount);
        }
        user.rewardDebt = user.client.depositedAmount.mul(pool.accbeimaPerShare).div(1e8);
    }

    
    function safebeimaTokenTransfer(address to, uint256 amount, uint256 pid) internal returns (uint256) {
        PoolInfo memory pool = poolInfo[pid];
        if (amount > pool.rewardsAmount) {
            beimaToken.transfer(to, pool.rewardsAmount);
            return pool.rewardsAmount;
        } else {
            beimaToken.transfer(to, amount);
            return amount;
        }
    }
    
    function setbeimaTokenPerBlock(uint256 _beimaTokenPerBlock) external onlyOwner {
        require(_beimaTokenPerBlock > 0, "beimaToken per block should be greater than 0!");
        beimaTokenPerBlock = _beimaTokenPerBlock;
    }
}
