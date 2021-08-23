pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

contract Campaign {
  struct Request {
    string description;
    uint256 value;
    address recipient;
    bool complete;
    uint256 approvalCount;
  }

  Request[] public requests;
  address public manager;
  uint256 public minimumContribution;
  string public description;
  uint256 public approversCount;
  mapping(address => bool) public approvers;
  mapping(address => bool) public approvals;

  modifier restricted() {
    require(msg.sender == manager);
    _;
  }

  constructor(
    string memory _description,
    uint256 _minimum,
    address creator
  ) {
    manager = creator;
    minimumContribution = _minimum;
    description = _description;
  }

  function contribute() public payable {
    require(msg.value > minimumContribution);
    approvers[msg.sender] = true;
    approversCount++;
  }

  function createRequest(
    string memory _description,
    uint256 _value,
    address _recipient
  ) public restricted {
    Request memory newRequest = Request({
      description: _description,
      value: _value,
      recipient: _recipient,
      complete: false,
      approvalCount: 0
    });
    requests.push(newRequest);
  }

  function approveRequest(uint256 _index) public {
    require(approvers[msg.sender]);
    require(!approvals[msg.sender]);

    approvals[msg.sender] = true;
    requests[_index].approvalCount++;
  }

  function finaliseRequest(uint256 _index) public restricted {
    Request storage request = requests[_index];

    require(request.approvalCount > (approversCount / 2));
    require(!request.complete);

    payable(request.recipient).transfer(request.value);
    request.complete = true;
  }

  function getSummary()
    public
    view
    returns (
      uint256,
      uint256,
      uint256,
      uint256,
      address
    )
  {
    return (
      minimumContribution,
      address(this).balance,
      requests.length,
      approversCount,
      manager
    );
  }

  function getRequestsCount() public view returns (uint256) {
    return requests.length;
  }
}
