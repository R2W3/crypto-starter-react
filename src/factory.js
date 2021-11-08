import web3 from './web3';
import CampaignFactory from './abis/CampaignFactory.json';

const instance = networkId => {
  return new web3.eth.Contract(
    CampaignFactory.abi,
    networkId !== '4'
      ? '0xE16F0ed48C4457462E5B50421826A480F06389a1'
      : CampaignFactory.networks[networkId].address
  );
};

export default instance;
