import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import NewsList from './List.jsx';
import SearchBar from './SearchBar.jsx';
import TagList from './TagList.jsx';
import { shuffle } from '../utils.js';
import Globe from './Globe.jsx';

const Content = styled.div`
  height: 97%;
  width: 38%;
  bottom: 0;
  position: absolute;
`;

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.376) 88%, rgba(0, 0, 0, 0) 100%);
  height: 97%;
  bottom: 0;
  color: white;
  overflow: hidden;
  overflow-y: scroll;
`

const CollapseButton = styled.button`
  position: absolute;
  top: 0;
  color: white;
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
      collapse: true,
    }
    this.getPopularToday = this.getPopularToday.bind(this);
    this.submitTag = this.submitTag.bind(this);
    this.getArticlesByTags = this.getArticlesByTags.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.setSignInShow = this.setSignInShow.bind(this);
    this.submitUser = this.submitUser.bind(this);
    this.removeCurrentUser = this.removeCurrentUser.bind(this);
    this.backToHome = this.backToHome.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.grabClickedCountry = this.grabClickedCountry.bind(this);
  }

  componentDidMount() {
    this.getPopularToday();
    document.addEventListener('click', this.grabClickedCountry);
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

  grabClickedCountry() {
    axios.get('/api/search/:country')
      .then(({ data }) => {
        this.setState({
          articles: data.articles,
          totalResults: data.totalResults
        })
      })
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


  toggleCollapse() {
    this.setState({
      collapse: !this.state.collapse
    });
  }

  render () {
    const { articles, totalResults, tags, collapse } = this.state;
    return (
      <Content>
        {
          !collapse 
          ? <FeedContainer>
            {/* <SearchBar submitTag={ this.submitTag } /> */}
            {/* <TagList tags={ tags } removeTag={ this.removeTag } /> */}
            <NewsList
              articles={ articles }
              total={ totalResults }
            />
          </FeedContainer>
          : null
        }
        <CollapseButton  onClick={() => this.toggleCollapse()}>
          <FontAwesomeIcon icon={faBars}/>
        </CollapseButton>
      </Content>
    )
  }
}
