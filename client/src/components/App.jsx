import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

import NewsList from './List.jsx';
import SearchBar from './SearchBar.jsx';
import TagList from './TagList.jsx';
import { shuffle } from '../utils.js';

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      articles: [],
      totalResults: 0,
      tags: [],
    }
    this.getPopularToday = this.getPopularToday.bind(this);
    this.submitTag = this.submitTag.bind(this);
    this.getArticlesByTags = this.getArticlesByTags.bind(this);
    this.removeTag = this.removeTag.bind(this);
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

  render () {
    const { articles, totalResults, tags } = this.state;
    return (
    <div>
      <h1 className='main-title'>YourNews</h1>
      <FeedContainer>
        <SearchBar submitTag={ this.submitTag } />
        <TagList tags={ tags } removeTag={ this.removeTag } />
        <NewsList
          articles={ articles }
          total={ totalResults }
        />
      </FeedContainer>
    </div>)
  }
}
