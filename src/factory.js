import web3 from './web3';
import CampaignFactory from './abis/CampaignFactory.json';

const instance = networkId => {
  return new web3.eth.Contract(
    CampaignFactory.abi,
    networkId !== '4'
      ? '0xBE3f91172B1000E2DA4A97BeaF3940BD9FCA6Cf6'
      : CampaignFactory.networks[networkId].address
  );
};

export default instance;
