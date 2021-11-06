import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import web3 from '../web3';
import Campaign from '../campaign';
import { create } from 'ipfs-http-client';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import Web3Context from '../context/web3Context';

const ipfs = create('https://ipfs.infura.io:5001/api/v0');

const ImageForm = ({ address, summary }) => {
  const [description, setDescription] = useState('');
  const [imageHash, setImageHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const web3Account = useContext(Web3Context);

  const captureImage = async event => {
    event.preventDefault();

    const image = event.target.files[0];

    try {
      console.log('Submitting file to ipfs...');
      const uploadedImage = await ipfs.add(image);

      setImageHash(uploadedImage.path);
    } catch (error) {
      setErrorMessage(error.message);
    }
    console.log('Submitted file to ipfs...');
  };

  const onSubmit = async event => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .uploadImage(imageHash, description)
        .send({ from: accounts[0] });

      setDescription('');
      history.push(`/campaigns/${address}`);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  const contribute = () => {
    if (summary) return summary.manager === web3Account.account ? false : true;
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
            <Button
              variant='outline-primary'
              type='submit'
              className='mb-3'
              disabled={contribute()}
            >
              Upload
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
      <Row className='justify-content-center mt-3'>
        <Col>
          <Form onSubmit={onSubmit}>
            <Form.Group className='mb-3' id='description'>
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description here... and add up to 4 images to IPFS'
                value={description}
                required
                onChange={event => setDescription(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='formFile' className='mb-3'>
              <Form.Control
                type='file'
                accept='.jpg, jpeg, png, gif, bmp, png'
                required
                onChange={captureImage}
              />
            </Form.Group>
            {renderErrorMessage()}
            <Row>{renderButton()}</Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default ImageForm;
