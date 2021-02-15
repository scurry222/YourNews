import React, { Component } from 'react';

export default class SearchBar extends Component {
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
    this.props.submitTag(tagName, () => {
      this.setState({
        tagName: '',
      })
    })
  }

  render() {
    return (
      <form className='search-bar' onSubmit={ this.handleSubmit }>
        <input
            className='tag'
            name='tag'
            value={ this.state.tagName }
            onChange={ this.handleInput }
        />
        <button>Submit</button>
      </form>
    )
  }
}