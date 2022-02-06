import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useContext } from 'react';
import Web3Context from '../context/web3Context';

const Header = () => {
  const web3 = useContext(Web3Context);

  return (
    <Navbar sticky='top' bg='dark' expand='lg' variant='dark'>
      <Container fluid='xl'>
        <Navbar.Brand
          href='/'
          target='_blank'
          rel='noopener noreferrer'
        >
          DeSource
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav>
            <NavLink className='nav-item nav-link' to='/campaigns'>
              Current Campaigns
            </NavLink>
            <NavLink
              className={`nav-item nav-link ${
                web3.network !== 'Rinkeby' ? 'd-none' : ''
              }`}
              to='/campaigns/new'
            >
              Create Campaign
            </NavLink>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className='justify-content-end d-none d-lg-block'>
          <Nav>
            <a
              className='nav-link small'
              href={`https://rinkeby.etherscan.io/address/${web3.account}`}
              target='_blank'
              rel='noopener noreferrer'
            > Wallet Address :  
              {web3.account &&
                web3.account.substring(0, 6) +
                  '...' +
                  web3.account.substring(38, 42)}
              &nbsp;&nbsp;&nbsp;
              Wallet Balance :
              {web3.account && web3.balance}
              &nbsp;&nbsp;&nbsp;
              Connected Network :
              {web3.account && web3.network}
            </a>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
