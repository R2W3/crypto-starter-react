import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CampaignContext from '../context/campaignContext';
import { loadCampaign, loadImages } from '../loadCampaignData';
import Cards from './Cards';
import Images from './Images';
import ImageForm from './ImageForm';
import ContributeForm from './ContributeForm';
import SkeletonCard from '../skeletons/SkeletonCard';
import { useContext } from 'react';
import Web3Context from '../context/web3Context';
import { Row, Col } from 'react-bootstrap';

const CampaignDetails = () => {
  const [summary, setSummary] = useState(null);
  const [images, setImages] = useState([]);

  const { address } = useParams();
  const web3 = useContext(Web3Context);

  useEffect(() => {
    loadCampaign(address, setSummary);
    loadImages(address, setImages);
  }, [address, images]);

  const renderSkeletons = () => {
    return [1, 2, 3, 4].map(n => <SkeletonCard key={n} theme='light' />);
  };

  return (
    <CampaignContext.Provider value={summary}>
      <h3 className='headingText text-center text-lg-start'>Show Campaign</h3>
      <Row className='text-center'>
        <Col className='mb-4 d-lg-none'>
          <Link to={`/campaigns/${address}/requests`}>
            <button type='button' className='btn btn-outline-primary'>
              View Requests
            </button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col lg={images.length ? 7 : null} className='text-center'>
          <Cards />
          <Link to={`/campaigns/${address}/requests`}>
            <button
              type='button'
              className='btn btn-outline-primary d-none d-lg-inline'
            >
              View Requests
            </button>
          </Link>
          <Row>
            <Col md={images.length ? 12 : 6}>
              {web3.network === 'Rinkeby' && images.length < 4 && (
                <ImageForm address={address} summary={summary} />
              )}
            </Col>
            <Col md={6} className='mt-3'>
              {images.length === 0 && (
                <ContributeForm address={address} summary={summary} />
              )}
            </Col>
          </Row>
        </Col>
        {images.length !== 0 && (
          <Col lg={5}>
            <div className='text-center'>
              <ContributeForm address={address} summary={summary} />
            </div>
            {images && summary ? (
              <Images images={images} summary={summary} />
            ) : (
              renderSkeletons()
            )}
          </Col>
        )}
      </Row>
    </CampaignContext.Provider>
  );
};

export default CampaignDetails;
