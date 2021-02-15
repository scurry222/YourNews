import React from 'react';
import NewsList from './List.jsx';
import SearchBar from './SearchBar.jsx';
import axios from 'axios';

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
    console.log(tags)
    this.setState({ articles: [] });
    this.setState({ totalResults: 0 });
    tags.forEach((tag) => 
      axios.get(`/api/search/:${tag}`)
        .then(({ data }) => {
          this.setState({
            articles: [...articles, data.articles],
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

  render () {
    const { articles, totalResults } = this.state;
    return (
    <div>
      <h1 className='main-title'>YourNews</h1>
      <SearchBar submitTag={ this.submitTag } />
      <NewsList
        articles={ articles }
        total={ totalResults }
      />
    </div>)
  }
}
