import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Table, Button, Col, Row } from 'react-bootstrap';
import { loadCampaign, loadRequests } from '../loadCampaignData';
import RequestRow from './RequestRow';

const Requests = () => {
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState(null);

  const { address } = useParams();

  useEffect(() => {
    loadCampaign(address, setSummary);
    loadRequests(address, setRequests);
  }, [address, setSummary]);

  const renderRows = () => {
    if (requests && summary) {
      return requests.map((request, index) => {
        return (
          <RequestRow
            key={index}
            id={index}
            request={request}
            address={address}
            approversCount={summary.approversCount}
          />
        );
      });
    }
  };

  return (
    <div>
      <h3 className='headingText text-center text-lg-start'>Requests</h3>
      <Row className='text-center'>
        <Col>
          <Link to={`/campaigns/${address}/requests/new/`}>
            <Button variant='outline-primary' style={{ marginRight: 10 }}>
              Add Request
            </Button>
          </Link>
          <Link to={`/campaigns/${address}/`}>
            <Button variant='danger'>Back</Button>
          </Link>
        </Col>
      </Row>
      <Table responsive={'lg'}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Recipient</th>
            <th>Approval Count</th>
            <th>Approve</th>
            <th>Finalise</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </Table>
      <div>Found {requests && requests.length} requests</div>
    </div>
  );
};

export default Requests;
