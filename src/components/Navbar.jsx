import { useContext, useEffect, useState } from 'react';
import Web3Context from '../context/web3Context';

const Navbar = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);

  const web3 = useContext(Web3Context);

  const loadWeb3 = async web3 => {
    const accounts = await web3.eth.getAccounts();
    const account = await accounts[0];
    const etherBalance = await web3.eth.getBalance(account);
    let network = await web3.eth.net.getNetworkType();
    network = network.charAt(0).toUpperCase() + network.slice(1);

    setNetwork(network);
    setBalance((etherBalance / 10 ** 18).toFixed(5));
    setAccount(account);
  };

  useEffect(() => {
    if (window.ethereum && web3 !== null) {
      loadWeb3(web3);

      window.ethereum.on('accountsChanged', () => {
        loadWeb3(web3);
      });

      window.ethereum.on('chainChanged', () => {
        loadWeb3(web3);
      });
    } else {
      return null;
    }
  }, [web3]);

  return (
    <nav className='navbar sticky-top navbar-expand-lg navbar-dark bg-primary'>
      <div className='container-sm justify-content-center justify-content-sm-between'>
        <a
          className='navbar-brand'
          href='https://jamieanderson.eth.link'
          target='_blank'
          rel='noopener noreferrer'
        >
          CryptoStarter
        </a>

        <ul className='navbar-nav ml-auto d-none d-sm-block'>
          <li className='nav-item'>
            <a
              className='nav-link small'
              href={`https://rinkeby.etherscan.io/address/${account}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {account &&
                account.substring(0, 6) + '...' + account.substring(38, 42)}
              &nbsp;&nbsp;&nbsp;
              {account && balance}
              &nbsp;&nbsp;&nbsp;
              {account && network}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
