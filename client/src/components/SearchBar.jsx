import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import styled from 'styled-components';

const SearchbarContainer = styled.form`
  display: flex;
  align-items: center;
  height: 2rem;
  width: 30%;
  border-radius: 2rem;
  border: 1px solid lightgrey;
  margin-top: 2rem;
`;

const SearchbarInput = styled.input`
  width: 94%;
  height: 100%;
  outline: none;
  border-radius: 2rem;
  padding: 0 1rem;
  border: none;
`;

const SearchbarButton = styled.button`
  border: none;
  outline: none;
  background: #fff;
`;

export default class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagName: '',
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(e) {
    const { value } = e.target;
    this.setState({
      tagName: value
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    const { tagName } = this.state;
    tagName
    ? this.props.submitTag(tagName, () => {
      this.setState({
        tagName: '',
      })
    })
    : null;
  }

  render() {
    return (
      <SearchbarContainer
        onSubmit={ this.handleSubmit }>
        <SearchbarInput
            name='tag'
            value={ this.state.tagName }
            onChange={ this.handleInput }
        />
        <SearchbarButton><FontAwesomeIcon icon={faSearch}/></SearchbarButton>
      </SearchbarContainer>
    )
  }
}