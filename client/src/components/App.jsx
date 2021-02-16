import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

import NewsList from './List.jsx';
import SearchBar from './SearchBar.jsx';
import TagList from './TagList.jsx';
import SignInModal from './SignInModal.jsx'
import { shuffle } from '../utils.js';

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Header = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 3rem;
  padding: 0 0.5rem;
  border-bottom: 2px solid lightskyblue;
`;

const MainTitle = styled.h1`
  font-size: 1.5rem;
  top:0;
`;

const SignIn = styled.button`

`

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      articles: [],
      totalResults: 0,
      tags: [],
      modalShow: false,
      user: '',
    }
    this.getPopularToday = this.getPopularToday.bind(this);
    this.submitTag = this.submitTag.bind(this);
    this.getArticlesByTags = this.getArticlesByTags.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.setModalShow = this.setModalShow.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  componentDidMount() {
    this.getPopularToday();
  }

  getPopularToday() {
    axios.get('/api/popular')
      .then(({ data }) => {
        this.setState({
          articles: data.articles,
          totalResults: data.totalResults,
        })
      })
      .catch((err) => console.error(err));
  }

  getArticlesByTags() {
    const { tags, articles, totalResults } = this.state;
    this.setState({ articles: [] });
    this.setState({ totalResults: 0 });
    tags.forEach((tag) => 
      axios.get(`/api/search/:${tag}`)
        .then(({ data }) => {
          this.setState({
            articles: shuffle(articles.concat(data.articles)),
            totalResults: totalResults + data.totalResults
        })
      })
    )
  }

  submitTag(tag, callback) {
    const { tags } = this.state;
    this.setState({ tags: [...tags, tag] }, () => {
      callback();
      this.getArticlesByTags();
    });
  }

  removeTag(tag) {
    const { tags } = this.state;
    tags.splice(tags.indexOf(tag));
    this.setState({ tags }, () => {
      this.getArticlesByTags();
    })
  }

  setModalShow() {
    this.setState({modalShow: !this.state.modalShow});
  }

  addUser(username) {
    this.setState({user: username})
  }

  render () {
    const { articles, totalResults, tags, modalShow } = this.state;
    return (
    <div>
      <Header >
        <MainTitle>YourNews</MainTitle>
        <SignIn onClick={ this.setModalShow }>Sign In</SignIn>
      </Header>
      <FeedContainer>
        <SearchBar submitTag={ this.submitTag } />
        <TagList tags={ tags } removeTag={ this.removeTag } />
        <NewsList
          articles={ articles }
          total={ totalResults }
        />
      </FeedContainer>
      <SignInModal 
        show={modalShow}
        onHide={() => this.setModalShow}
      />
    </div>)
  }
}
