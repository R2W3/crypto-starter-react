import Factory from './factory';
import Campaign from './campaign';
import web3 from './web3';

export const loadCampaigns = async setCampaigns => {
  const networkId = await web3.eth.net.getId();
  const factory = Factory(networkId);
  const campaignsAddress = await factory.methods.getDeployedCampaigns().call();

  const result = [];

  for (let address in campaignsAddress) {
    const campaignData = { address: '', description: '' };

    const campaign = Campaign(campaignsAddress[address]);
    const campaignDescription = await campaign.methods.description().call();

    campaignData.address = campaignsAddress[address];
    campaignData.description = campaignDescription;

    result.push(campaignData);
  }

  setCampaigns(result);
};

export const loadCampaign = async (address, setSummary) => {
  const campaign = Campaign(address);
  const summaryData = await campaign.methods.getSummary().call();
  const descriptionData = await campaign.methods.description().call();

  const data = {
    address,
    description: descriptionData,
    minimumContribution: summaryData[0],
    balance: summaryData[1],
    requestsCount: summaryData[2],
    approversCount: summaryData[3],
    manager: summaryData[4],
  };

  setSummary(data);
};
