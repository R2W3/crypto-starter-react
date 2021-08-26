const CampaignFactory = artifacts.require('../contracts/CampaignFactory');
const Campaign = artifacts.require('../contracts/Campaign');
const { isAccessor } = require('typescript');
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

    it('requires a description', async () => {
      try {
        await factory.createCampaign('', '100');
        assert(false);
      } catch (error) {
        assert(error);
      }
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

    it('cancels a campaign', async () => {
      let cancelledCampaign;
      await campaign.cancelCampaign(campaignAddress, { from: deployer });
      cancelledCampaign = await campaign.cancelledCampaigns(campaignAddress);
      assert(cancelledCampaign);
    });

    it('manager can only cancel a campaign', async () => {
      try {
        await campaign.cancelCampaign(campaignAddress, { from: user1 });
        assert(false);
      } catch (error) {
        assert(error);
      }
    });
  });

  describe('images', () => {
    let result;
    let imageCount;
    const hash = 'abc123';
    const description = 'image description';

    beforeEach(async () => {
      result = await campaign.uploadImage(hash, description, {
        from: deployer,
      });
      imageCount = await campaign.imageCount();
    });

    it('creates images', async () => {
      assert.equal(imageCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct');
      assert.equal(event.hash, hash, 'hash is correct');
      assert.equal(event.description, description, 'description is correct');
    });

    it('requires a image has a hash', async () => {
      try {
        await campaign.uploadImage('', description, { from: deployer });
        assert(false);
      } catch (error) {
        assert(error);
      }
    });

    it('requires a image has a description', async () => {
      try {
        await campaign.uploadImage(hash, '', { from: deployer });
        assert(false);
      } catch (error) {
        assert(error);
      }
    });

    it('requires a image can only be uploaded by the manager', async () => {
      try {
        await campaign.uploadImage(hash, description, { from: user1 });
        assert(false);
      } catch (error) {
        assert(error);
      }
    });

    it('lists images', async () => {
      const image = await campaign.images(imageCount);
      assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct');
      assert.equal(image.hash, hash, 'hash is correct');
      assert.equal(image.description, description, 'description is correct');
    });
  });
});
