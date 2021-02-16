import React from 'react';
import Modal from 'react-bootstrap/Modal';

const SignInModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            SignIn
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form >
            <input type="text"/>

          </form>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={props.onHide()}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }

  export default SignInModal;
