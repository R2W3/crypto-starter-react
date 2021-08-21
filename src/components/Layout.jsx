import web3 from '../web3';
import Web3Context from '../context/web3Context';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <Web3Context.Provider value={web3}>
      <Navbar />
      <div className='container'>{children}</div>
    </Web3Context.Provider>
  );
};

export default Layout;
