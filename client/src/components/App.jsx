import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

import NewsList from './List.jsx';
import SearchBar from './SearchBar.jsx';
import TagList from './TagList.jsx';
import SignInPage from './SignInPage.jsx'
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
  cursor: pointer;
`;

const SignIn = styled.button`

`

const UserName = styled.div`
  font-size: 1.4rem;
  cursor: pointer;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      articles: [],
      totalResults: 0,
      tags: [],
      signInShow: false,
      displayName: '',
    }
    this.getPopularToday = this.getPopularToday.bind(this);
    this.submitTag = this.submitTag.bind(this);
    this.getArticlesByTags = this.getArticlesByTags.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.setSignInShow = this.setSignInShow.bind(this);
    this.submitUser = this.submitUser.bind(this);
    this.removeCurrentUser = this.removeCurrentUser.bind(this);
    this.backToHome = this.backToHome.bind(this);
  }

  componentDidMount() {
    // this.getPopularToday();
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

  setSignInShow() {
    this.setState({signInShow: !this.state.signInShow});
  }

  removeCurrentUser() {
    this.setState({ displayName: '' })
  }
  
  backToHome() {
    this.setState({ signInShow: false })
  }

  submitUser({username, password}, callback) {
    this.setState({ displayName: username }, () => {
      this.setSignInShow();
      callback();
    })
  }

  render () {
    const { articles, totalResults, tags, signInShow, displayName } = this.state;
    return (
    <div>
      <Header>
        <MainTitle onClick={ this.backToHome }>YourNews</MainTitle>
        {
          !displayName
          ? <SignIn onClick={ this.setSignInShow }>Sign In</SignIn>
          : <UserName onClick={ this.removeCurrentUser }>{ displayName }</UserName>
        }
      </Header>
      {
        !signInShow
        ? <FeedContainer>
          <SearchBar submitTag={ this.submitTag } />
          <TagList tags={ tags } removeTag={ this.removeTag } />
          <NewsList
            articles={ articles }
            total={ totalResults }
          />
          </FeedContainer>
        : <SignInPage
          submitUser={ this.submitUser }
        />
      }
    </div>
    )
  }
}
