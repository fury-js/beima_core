// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {DataTypes} from './libraries/DataTypes.sol';

interface LendingPoolInterface{
	function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
	function withdraw(address asset, uint256 amount, address to) external returns (uint256);
	function getReserveData(address asset)external view returns (DataTypes.ReserveData memory);
	function getUserAccountData(address user) external view returns (uint256, uint256, uint256 ,uint256 , uint256 , uint256);
}