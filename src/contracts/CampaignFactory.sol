pragma solidity ^0.8.0;

import './Campaign.sol';

// SPDX-License-Identifier: MIT

contract CampaignFactory {
  address[] public deployedCampaigns;

  function createCampaign(string memory _description, uint256 _minimum) public {
    Campaign newCampaign = new Campaign(_description, _minimum, msg.sender);
    deployedCampaigns.push(address(newCampaign));
  }

  function getDeployedCampaigns() public view returns (address[] memory) {
    return deployedCampaigns;
  }
}
