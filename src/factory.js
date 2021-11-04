import web3 from './web3';
import CampaignFactory from './abis/CampaignFactory.json';

const instance = networkId => {
  return new web3.eth.Contract(
    CampaignFactory.abi,
    networkId !== '4'
      ? '0x571da9d488DBD0754396AFdf4d3FE2E1C15c6C6A'
      : CampaignFactory.networks[networkId].address
  );
};

export default instance;
