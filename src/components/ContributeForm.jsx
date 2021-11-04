import web3 from '../web3';
import { useHistory } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useContext, useState } from 'react';
import Campaign from '../campaign';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import Web3Context from '../context/web3Context';

const ContributeForm = ({ address, summary }) => {
  const [contribution, setContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const web3Account = useContext(Web3Context);

  const onSubmit = async event => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, 'ether'),
      });
      history.push(`/campaigns/${address}`);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
    setContribution('');
  };

  const contribute = () => {
    if (summary) return summary.manager === web3Account.account ? true : false;
  };

  const renderButton = () => {
    return (
      <div className='text-center'>
        {loading ? (
          <Button variant='primary' type='submit' disabled className='mb-4'>
            Pending &nbsp;
            <span
              className='spinner-grow spinner-grow-sm'
              role='status'
              aria-hidden='true'
            ></span>
          </Button>
        ) : (
          <div className='text-center'>
            <Button
              variant='outline-primary'
              type='submit'
              className='mb-4'
              disabled={contribute()}
            >
              Contribute
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderErrorMessage = () => {
    return errorMessage && <Alert variant='danger'>Oops! {errorMessage}</Alert>;
  };

  return (
    <>
      <Row className='justify-content-center'>
        <Col>
          <Form onSubmit={onSubmit}>
            <Form.Group className='mb-3' id='contribution'>
              <Form.Label>Amount to Contribute</Form.Label>
              <InputGroup>
                <Form.Control
                  type='number'
                  placeholder='eg. 0.01'
                  value={contribution}
                  onChange={event => setContribution(event.target.value)}
                />
                <InputGroup.Text>ether</InputGroup.Text>
              </InputGroup>
            </Form.Group>
            {renderErrorMessage()}
            <Row>{renderButton()}</Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default ContributeForm;
