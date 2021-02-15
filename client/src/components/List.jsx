import React, { useState, useEffect } from 'react';
import ListItem from './ListItem.jsx';

const NewsList = ({ articles, total }) => {
  const [feed, setFeed] = useState([]);
  useEffect(() => {
    setFeed(articles)
  }, [articles])
  return (
  <div className='news-list'>
      There are { total } articles.
      {
        feed.map((article, i) => <ListItem key={i} article={ article }/>)
      }
    </div>
  )
}


export default NewsList;
