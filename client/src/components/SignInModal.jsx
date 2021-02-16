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
          <form onSubmit={(e) => props.handleSignInSubmit(e)}>
            Username: 
            <input
              name="username"
              value={props.username}
              onChange={(e) => props.handleSignInInput(e)}
              />
            Password:
            <input 
              password="password"
              value={props.password}
              onChange={(e) => props.handleSignInInput(e)}
            />
            <button>Submit</button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={props.onHide()}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }

  export default SignInModal;
