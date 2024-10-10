import axios from 'axios';
import { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';

function ReactModal() {

  const [show, setShow] = useState(false);
  const DRcontract = useSelector((state) => { return state.user.DRcontract })
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(async () => {
    const response = await axios.get('http://localhost:5000/doctors-list');
    const doctors = await response.data;
    console.log("Fetched doctors list for modal : ", doctors);
    for(let doctor of doctors){
      console.log("doctor -> ", doctor.hash);
      const doctorDetails = await DRcontract.getDoctorDetails(doctor.hash);
      console.log("Doctors details -> ", doctorDetails);
    }
  }, [DRcontract]);

  return (
    <>
      {/* Button to trigger the modal */}
      <Button variant="primary" onClick={handleShow}>
        Launch Modal
      </Button>

      {/* Modal with custom styles to keep it centered */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static" // prevents clicking outside to close the modal
        keyboard={false} // disables closing via ESC key
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          height: '70vh',
          width: '50vw',
          border: '1px solid black',
          transform: 'translate(-50%, -50%)',
          zIndex: 1050,
          
        }}
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Centered Modal</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Modal body text goes here.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ReactModal;
