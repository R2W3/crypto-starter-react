import { useState } from 'react';
import Factory from '../factory';
import { Link, useHistory } from 'react-router-dom';
import web3 from '../web3';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';

const CreateCampaign = () => {
  const [minimumContribution, setMinimumContribution] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const onSubmit = async event => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      const networkId = await web3.eth.net.getId();
      const factory = Factory(networkId);
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(
          description,
          web3.utils.toWei(minimumContribution, 'ether')
        )
        .send({ from: accounts[0] });

      history.push('/');
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  const renderButton = () => {
    return (
      <div className='text-center text-lg-start'>
        {loading ? (
          <Button variant='primary' type='submit' disabled>
            Pending &nbsp;
            <span
              className='spinner-grow spinner-grow-sm'
              role='status'
              aria-hidden='true'
            ></span>
          </Button>
        ) : (
          <div>
            <Button variant='outline-primary' type='submit' className='me-3'>
              Create
            </Button>
            <Link to={'/'}>
              <Button variant='danger'>Cancel</Button>
            </Link>
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
      <h3 className='headingText text-center text-lg-start'>
        Create a Campaign
      </h3>
      <Row className='justify-content-center'>
        <Col lg={7}>
          <Form onSubmit={onSubmit}>
            <Form.Group className='mb-3' id='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='eg. I want to create......'
                required
                value={description}
                onChange={event => setDescription(event.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-4' id='minimumContribution'>
              <Form.Label>Minimum Contribution</Form.Label>
              <InputGroup>
                <Form.Control
                  type='number'
                  placeholder='eg. 0.001'
                  value={minimumContribution}
                  onChange={event => setMinimumContribution(event.target.value)}
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

export default CreateCampaign;
