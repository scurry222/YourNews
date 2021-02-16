import React, { Component } from 'react';
import styled from 'styled-components';


const SignInContainer = styled.div`
`;

const SignInForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30%;
`

const SignInInput = styled.input``;

export default class SignInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, password } = this.state;
    username && password
    ? this.props.submitUser(this.state, () => {
      this.setState({
        username: '',
        password: '',
      })
    })
    : null;
  }

  render() {
    return (
      <SignInContainer>
        <SignInForm
          onSubmit={ this.handleSubmit }>
            UserName:
          <SignInInput
              name='username'
              value={ this.state.username }
              onChange={ this.handleInput }
          />
            Password:
          <SignInInput
              name='password'
              value={ this.state.password }
              onChange={ this.handleInput }
          />
          <button>Submit</button>
        </SignInForm>
      </SignInContainer>
    )
  }
}