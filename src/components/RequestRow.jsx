import { useState } from 'react';
import web3 from '../web3';
import Campaign from '../campaign';
import { Button } from 'react-bootstrap';

const RequestRow = ({
  id,
  request,
  address,
  approversCount,
  approved,
  manager,
  account,
}) => {
  const [loading, setLoading] = useState(false);

  const { description, recipient, approvalCount, complete } = request;
  const readyToFinalise = approvalCount > approversCount / 2;

  const handleApprove = async () => {
    setLoading(true);

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(id).send({ from: accounts[0] });
    } catch (error) {
      console.error(error.message);
    }

    setLoading(false);
  };

  const handleFinalise = async () => {
    setLoading(true);

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finaliseRequest(id).send({ from: accounts[0] });
    } catch (error) {
      console.error(error.message);
    }

    setLoading(false);
  };

  const textMuted = () => {
    return complete ? 'text-muted' : '';
  };

  const finalsedText = () => {
    return complete ? '' : <p style={{ color: 'red' }}>Please Finalise!</p>;
  };

  const renderApproveButton = () => {
    return (
      <div>
        {loading ? (
          <Button
            variant='outline-success'
            basic
            onClick={handleApprove}
            disabled
          >
            Pending &nbsp;
            <span
              className='spinner-grow spinner-grow-sm'
              role='status'
              aria-hidden='true'
            ></span>
          </Button>
        ) : (
          <div>
            <Button
              variant='outline-success'
              basic
              onClick={handleApprove}
              disabled={manager === account}
            >
              Approve
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderFinaliseButton = () => {
    return (
      <div>
        {loading && readyToFinalise ? (
          <Button
            variant='outline-info'
            basic
            onClick={handleFinalise}
            disabled
          >
            Pending &nbsp;
            <span
              className='spinner-grow spinner-grow-sm'
              role='status'
              aria-hidden='true'
            ></span>
          </Button>
        ) : (
          <Button
            disabled={!readyToFinalise || manager !== account}
            variant='outline-info'
            basic
            onClick={handleFinalise}
          >
            Finalise
          </Button>
        )}
      </div>
    );
  };

  return (
    <tr>
      <td className={textMuted()}>{id + 1}</td>
      <td className={textMuted()}>{description}</td>
      <td className={textMuted()}>{web3.utils.fromWei(request[1], 'ether')}</td>
      <td className={textMuted()}>{recipient}</td>
      <td className={textMuted()}>
        {approvalCount} / {approversCount}
      </td>
      <td>
        {complete || readyToFinalise ? finalsedText() : renderApproveButton()}
      </td>
      <td>
        {complete ? (
          <p className='text-success'>Finalised</p>
        ) : (
          renderFinaliseButton()
        )}
      </td>
    </tr>
  );
};

export default RequestRow;
