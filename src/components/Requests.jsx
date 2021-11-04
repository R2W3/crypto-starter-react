import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import Web3Context from '../context/web3Context';
import { Link } from 'react-router-dom';
import { Table, Button, Col, Row } from 'react-bootstrap';
import { loadCampaign, loadRequests, loadApproval } from '../loadCampaignData';
import RequestRow from './RequestRow';

const Requests = () => {
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState(null);
  const [approval, setApproval] = useState(false);

  const { address } = useParams();
  const web3 = useContext(Web3Context);

  useEffect(() => {
    loadCampaign(address, setSummary);
    loadRequests(address, setRequests);
    loadApproval(address, web3.account, setApproval);
  }, [address, web3.account, setSummary, requests]);

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
            approved={approval}
            manager={summary.manager}
            account={web3.account}
          />
        );
      });
    }
  };

  const disableLinks = () => {
    return summary.manager !== web3.account ? 'none' : '';
  };

  const renderRequestButton = () => {
    if (summary) {
      return (
        <Link
          to={`/campaigns/${address}/requests/new/`}
          style={{ pointerEvents: disableLinks() }}
        >
          <Button
            variant='outline-primary'
            style={{ marginRight: 10 }}
            disabled={summary.manager !== web3.account}
          >
            Add Request
          </Button>
        </Link>
      );
    } else return null;
  };

  return (
    <div>
      <h3 className='headingText text-center text-lg-start'>Requests</h3>
      <Row className='text-center'>
        <Col>
          {renderRequestButton()}
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
