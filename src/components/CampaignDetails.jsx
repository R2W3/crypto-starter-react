import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import CampaignContext from '../context/campaignContext';
import { loadCampaign } from '../loadCampaignData';
import Card from './Cards';

const CampaignDetails = () => {
  const [summary, setSummary] = useState(null);

  const { address } = useParams();

  useEffect(() => {
    loadCampaign(address, setSummary);
  }, [address]);

  return (
    <CampaignContext.Provider value={summary}>
      <h3 className='headingText text-center text-lg-start'>Show Campaign</h3>
      <Card />
    </CampaignContext.Provider>
  );
};

export default CampaignDetails;
