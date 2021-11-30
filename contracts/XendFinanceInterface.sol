// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


interface XendFinanceInterface{

    function withdraw(uint256 derivativeAmount) external;
    function deposit() external;
    function GetMemberXendTokenReward(address member)external view returns (uint256);
}