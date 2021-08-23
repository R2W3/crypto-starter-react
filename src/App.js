import { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import web3, { loadWeb3 } from './web3';
import Web3Context from './context/web3Context';
import Layout from './components/Layout';
import CampaignList from './components/CampaignList';
import CreateCampaign from './components/CreateCampaign';
import NotFound from './components/NotFound';
import CampaignDetails from './components/CampaignDetails';

const App = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);

  const web3User = { account, balance, network };

  useEffect(() => {
    if (window.ethereum && web3 !== null) {
      loadWeb3(web3, setNetwork, setBalance, setAccount);

      window.ethereum.on('accountsChanged', () => {
        loadWeb3(web3, setNetwork, setBalance, setAccount);
      });

      window.ethereum.on('chainChanged', () => {
        loadWeb3(web3, setNetwork, setBalance, setAccount);
      });
    } else {
      return null;
    }
  }, []);

  return (
    <Web3Context.Provider value={web3User}>
      <Layout>
        <Switch>
          <Route path='/campaigns/new' component={CreateCampaign} />
          <Route path='/campaigns/:address' component={CampaignDetails} />
          <Route path='/campaigns' component={CampaignList} />
          <Redirect from='/' exact to='/campaigns' />
          <Route path='*' component={NotFound} />
        </Switch>
      </Layout>
    </Web3Context.Provider>
  );
};

export default App;
