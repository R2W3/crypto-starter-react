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

  struct Image {
    uint256 id;
    string hash;
    string description;
  }

  event ImageCreated(uint256 id, string hash, string description);

  Request[] public requests;
  address[] approvalAddresses;
  address public manager;
  uint256 public minimumContribution;
  uint256 public approversCount;
  uint256 public imageCount = 0;
  string public description;
  mapping(address => bool) public approvers;
  mapping(address => bool) public approvals;
  mapping(uint256 => Image) public images;
  mapping(address => bool) public cancelledCampaigns;

  modifier restricted() {
    require(msg.sender != address(0x0));
    require(msg.sender == manager);
    _;
  }

  constructor(
    string memory _description,
    uint256 _minimum,
    address creator
  ) {
    require(msg.sender != address(0x0));
    manager = creator;
    minimumContribution = _minimum;
    description = _description;
  }

  function contribute() public payable {
    require(msg.value > minimumContribution);
    approvalAddresses.push(msg.sender);
    approvers[msg.sender] = true;
    approversCount++;
  }

  function createRequest(
    string memory _description,
    uint256 _value,
    address _recipient
  ) public restricted {
    require(bytes(_description).length > 0);

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

    for (uint256 i = 0; i < approvalAddresses.length; i++) {
      approvals[approvalAddresses[i]] = false;
      // delete approvalAddresses[i];
    }
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

  function uploadImage(string memory _imgHash, string memory _description)
    public
    restricted
  {
    require(bytes(_imgHash).length > 0);
    require(bytes(_description).length > 0);

    imageCount++;
    images[imageCount] = Image(imageCount, _imgHash, _description);
    emit ImageCreated(imageCount, _imgHash, _description);
  }

  function cancelCampaign(address _campaign) public restricted {
    cancelledCampaigns[_campaign] = true;
  }
}
