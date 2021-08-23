import { useContext } from 'react';
import CampaignContext from '../context/campaignContext';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const Cards = () => {
  const campaign = useContext(CampaignContext);

  return (
    <Row>
      <Col md={6} mb-3>
        <Card>
          <Card.Header>{campaign && campaign.address}</Card.Header>
          <Card.Body>
            <h6 className='card-subtitle mb-2 text-muted'>manager</h6>
            <Card.Text>
              The manager created this campaign and can create requests to
              withdraw money.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Cards;
