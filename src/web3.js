import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: 'eth_requestAccounts' });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/d7b47402ed384a04a146a3dee3c719a9'
  );
  web3 = new Web3(provider);
}

export const loadWeb3 = async (web3, setNetwork, setBalance, setAccount) => {
  const accounts = await web3.eth.getAccounts();
  const account = await accounts[0];
  const etherBalance = await web3.eth.getBalance(account);
  let network = await web3.eth.net.getNetworkType();
  network = network.charAt(0).toUpperCase() + network.slice(1);

  setNetwork(network);
  setBalance((etherBalance / 10 ** 18).toFixed(5));
  setAccount(account);
};

export default web3;
