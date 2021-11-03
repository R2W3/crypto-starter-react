import web3 from '../web3';
import Campaign from '../campaign';
import { Button } from 'react-bootstrap';

const RequestRow = ({ id, request, address, approversCount }) => {
  const { description, recipient, approvalCount, complete } = request;
  const readyToFinalise = approvalCount > approversCount / 2;

  const handleApprove = async () => {
    const campaign = Campaign(address);

    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(id).send({ from: accounts[0] });
  };

  const handleFinalise = async () => {
    const campaign = Campaign(address);

    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finaliseRequest(id).send({ from: accounts[0] });
  };

  const textMuted = () => {
    return complete ? 'text-muted' : '';
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
        {complete ? null : (
          <Button variant='outline-success' basic onClick={handleApprove}>
            Approve
          </Button>
        )}
      </td>
      <td>
        {complete ? (
          <p className='text-success'>Finalised</p>
        ) : (
          <Button
            disabled={!readyToFinalise}
            variant='outline-info'
            basic
            onClick={handleFinalise}
          >
            Finalise
          </Button>
        )}
      </td>
    </tr>
  );
};

export default RequestRow;
