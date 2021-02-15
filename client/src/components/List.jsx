import React from 'react';
import ListItem from './ListItem.jsx';

const NewsList = ({ articles, total }) => (
  <div className='news-list'>
      There are { total } articles.
      {
        articles.map((article, i) => <ListItem key={i} article={ article }/>)
      }
    </div>
)

export default NewsList;
