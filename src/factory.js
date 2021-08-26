import web3 from './web3';
import CampaignFactory from './abis/CampaignFactory.json';

const instance = networkId => {
  return new web3.eth.Contract(
    CampaignFactory.abi,
    networkId !== '4'
      ? '0x8F4BEa0e033886Dc9B411B553ea4399f468e3923'
      : CampaignFactory.networks[networkId].address
  );
};

export default instance;
