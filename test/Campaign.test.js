const CampaignFactory = artifacts.require('../contracts/CampaignFactory');
const Campaign = artifacts.require('../contracts/Campaign');
const Web3 = require('web3');

contract('CampaignFactory', ([deployer, user1]) => {
  let factory;
  let campaignAddress;
  let campaign;

  beforeEach(async () => {
    factory = await CampaignFactory.new();
    await factory.createCampaign('Make a decentralised computer game', '100');

    [campaignAddress] = await factory.getDeployedCampaigns();
    campaign = await Campaign.at(campaignAddress);
    campaignDescription = await campaign.description();
  });

  describe('Campaigns', () => {
    it('deploys a factory and a campaign', async () => {
      assert.ok(factory.address);
      assert.ok(campaign.address);
      assert.ok(campaignDescription);
    });

    it('marks caller as the campaign manager', async () => {
      const manager = await campaign.manager();
      assert.strictEqual(deployer, manager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
      await campaign.contribute({ value: '200', from: user1 });
      const isContributor = await campaign.approvers(user1);
      assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
      try {
        await campaign.contribute({ value: '5', from: user1 });
        assert(false);
      } catch (error) {
        assert(error);
      }
    });

    it('allows a manager to make a payment request', async () => {
      await campaign.createRequest('Buy batteries', '100', user1, {
        from: deployer,
      });

      const request = await campaign.requests(0);
      assert.strictEqual('Buy batteries', request.description);
    });

    it('processes requests', async () => {
      await campaign.contribute({
        from: deployer,
        value: Web3.utils.toWei('10', 'ether'),
      });

      await campaign.createRequest('A', Web3.utils.toWei('5', 'ether'), user1, {
        from: deployer,
      });

      await campaign.approveRequest(0, { from: deployer });

      await campaign.finaliseRequest(0, { from: deployer });

      let balance = user1;
      balance = Web3.utils.fromWei(balance, 'ether');
      balance = parseFloat(balance);
      assert(balance > 104);
    });
  });
});
