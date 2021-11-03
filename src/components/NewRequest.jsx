import { useState } from 'react';
import { useParams } from 'react-router';
import { Link, useHistory } from 'react-router-dom';
import web3 from '../web3';
import Campaign from '../campaign';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';

const NewRequest = () => {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { address } = useParams();
  const history = useHistory();

  const onSubmit = async event => {
    event.preventDefault();

    const campaign = Campaign(address);

    setLoading(true);
    setErrorMessage('');

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });

      history.push(`/campaigns/${address}/requests/`);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  const renderButton = () => {
    return (
      <div className='text-center'>
        {loading ? (
          <Button variant='primary' type='submit' disabled className='mb-3'>
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
            <Link to={`/campaigns/${address}/requests/`}>
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
    <div>
      <h3 className='headingText text-center text-lg-start'>Create Request</h3>
      <Row className='justify-content-center mt-3'>
        <Col lg={7}>
          <Form onSubmit={onSubmit}>
            <Form.Group className='mb-3' id='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description here...'
                value={description}
                required
                onChange={event => setDescription(event.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-3' id='description'>
              <Form.Label>Value in Ether</Form.Label>
              <InputGroup>
                <Form.Control
                  type='number'
                  placeholder='eg. 0.01'
                  value={value}
                  required
                  onChange={event => setValue(event.target.value)}
                />
                <InputGroup.Text>ether</InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId='formFile' className='mb-3'>
              <Form.Label>Recipient</Form.Label>
              <Form.Control
                type='text'
                required
                onChange={event => setRecipient(event.target.value)}
              />
            </Form.Group>
            {renderErrorMessage()}
            <Row>{renderButton()}</Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default NewRequest;
