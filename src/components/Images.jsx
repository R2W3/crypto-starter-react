import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const Images = ({ images }) => {
  return (
    <Row xs={1} md={2} className='g-3 text-center'>
      {images &&
        images.map((image, index) => (
          <Col key={index}>
            <Card>
              <Card.Img
                variant='top'
                style={{ height: '15rem' }}
                src={`https://ipfs.infura.io/ipfs/${image.hash}`}
              />
              <Card.Body>
                <Card.Text>{image.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
    </Row>
  );
};

export default Images;
