import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadCampaigns } from '../loadCampaignData';
import { useContext } from 'react';
import Web3Context from '../context/web3Context';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SkeletonCard from '../skeletons/SkeletonCard';
//import { auto } from '@popperjs/core';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState(null);

  const web3 = useContext(Web3Context);

  useEffect(() => {
    loadCampaigns(setCampaigns);
  }, []);

  const renderCards = () => {
    return campaigns.map(campaign => {
      return (
        <Card
          key={campaign.address}
          style={{ marginBottom: '30px' }}
          className='text-center'
        >
          <Card.Header>{campaign.address}</Card.Header>
          <Card.Body>
            <h6>{campaign.description}</h6>
            <Card.Text>
              <Link to={`/campaigns/${campaign.address}`}>View Campaign Details</Link>
            </Card.Text>
          </Card.Body>
        </Card>

      );
    });
  };

  const renderSkeletons = () => {
    return [1, 2, 3, 4, 5].map(n => <SkeletonCard key={n} theme='light' />);
  };

  return (
    <>
      <h3 className='headingText text-center text-md-center'>Current Campaigns</h3>
      <Col
        md={4}
        lg={4}
        className={`text-center text-md-end ${web3.network !== 'Rinkeby' ? 'd-none' : ''
          }`}
      >
        <Link to='/campaigns/new'>
          <button
            type='button'
            className='btn btn-outline-primary d-md-none mb-4'
          >
            <span>Create Campaign</span>
            &nbsp;
            <i className='bi bi-plus-circle-fill' />
          </button>
        </Link>
      </Col>
      <Row className='justify-content-center'>
        <Col md={8} lg={6}>
          {campaigns ? renderCards() : renderSkeletons()}
        </Col>

      </Row>
    </>
  );
};

export default CampaignList;
