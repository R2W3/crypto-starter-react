import { useContext } from 'react';
import CampaignContext from '../context/campaignContext';
import web3 from '../web3';
import SkeletonCard from '../skeletons/SkeletonCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const Cards = () => {
  const campaign = useContext(CampaignContext);

  const renderSkeletons = () => {
    return [1, 2, 3].map(n => <SkeletonCard key={n} theme='light' />);
  };

  return (
    <Row>
      {campaign ? (
        <>
          <Col md={6} mb={3} style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            
            <Card>
              <Card.Header>{campaign.description}</Card.Header>
              <Card.Body>
                <h6 className='card-subtitle mb-2 text-muted'>
                  {campaign.manager}
                </h6>
                <Card.Text>
                  Above address is the campaign initiator.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card className='my-3'>
              <Card.Header>Minimum Contribution (Matic)</Card.Header>
              <Card.Body>
                <h6 className='card-subtitle mb-2 text-muted'>
                  {web3.utils.fromWei(campaign.minimumContribution, 'ether')}
                </h6>
                <Card.Text>
                  Minimum contribution set by campaign initiator.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} mb={3}>
            <Card>
              <Card.Header>Number of Requests</Card.Header>
              <Card.Body>
                <h6 className='card-subtitle mb-2 text-muted'>
                  {campaign.requestsCount}
                </h6>
                <Card.Text>
                  Number of withdrawl requests. Must be approved.
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='my-3'>
              <Card.Header>Number of Approvers</Card.Header>
              <Card.Body>
                <h6 className='card-subtitle mb-2 text-muted'>
                  {campaign.approversCount}
                </h6>
                <Card.Text>
                  Number of people who have donated to this campaign.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xlg={8}>
            <Card className='text-md-center mb-3'>
              <Card.Header>Campaign Balance (ether)</Card.Header>
              <Card.Body>
                <h6 className='card-subtitle mb-2 text-muted'>
                  {web3.utils.fromWei(campaign.balance, 'ether')}
                </h6>
                <Card.Text>
                  The balance is how much money this campaign has left to spend.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </>
      ) : (
        <Row>
          <Col md={6}>{renderSkeletons()}</Col>
          <Col md={6}>{renderSkeletons()}</Col>
        </Row>
      )}
    </Row>
  );
};

export default Cards;
