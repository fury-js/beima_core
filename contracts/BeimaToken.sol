//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BeimaToken is ERC20 {
    address public admin;
    address public minter;

    constructor() ERC20("Beima Token", "BMP") public {
        admin = msg.sender;
        minter = msg.sender;
    }

    function setMinter(address _minter) public {
        require(msg.sender == admin, "Only admin can call");
        minter = _minter;
    }

    function mint(address _to, uint256 _amount) external {
        require(msg.sender == minter || msg.sender == admin, "Only Authorized account can call");
        _mint(_to, _amount);
    }

    function getTotalSupply() public view returns(uint) {
        return totalSupply();
    }
}