import { useState } from 'react';
import web3 from '../web3';
import Campaign from '../campaign';
import { create } from 'ipfs-http-client';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

const ipfs = create('https://ipfs.infura.io:5001/api/v0');

const ImageForm = ({ address }) => {
  const [description, setDescription] = useState('');
  const [imageHash, setImageHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
            <Button variant='outline-primary' type='submit' className='mb-3'>
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
      <Row className='justify-content-center'>
        <Col>
          <h4 className='headingText text-center text-lg-start'>
            Upload Image
          </h4>
          <Form onSubmit={onSubmit}>
            <Form.Group className='mb-3' id='description'>
              <Form.Control
                type='text'
                placeholder='Enter description here... and add up to 4 images'
                value={description}
                required
                onChange={event => setDescription(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='formFile' className='mb-3'>
              <Form.Control
                type='file'
                accept='.jpg, jpeg, png, gif, bmp'
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
