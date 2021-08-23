import web3 from './web3';
import CampaignFactory from './abis/CampaignFactory.json';

const instance = networkId => {
  return new web3.eth.Contract(
    CampaignFactory.abi,
    networkId !== '4'
      ? '0x373d8A89e4A5B5706F4d298a7749Bb0ea3AF8875'
      : CampaignFactory.networks[networkId].address
  );
};

export default instance;
