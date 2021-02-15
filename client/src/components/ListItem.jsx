import React from 'react';

const ListItem = ({article}) => (
  <article
    className='article'
    // onClick={}
  >
    <img 
      className='article-image'
      src={article.urlToImage} 
      alt="Missing Image"/>
    <div className='article-title'>
      { article.title }
    </div>
    <div className='article-description'>
      { article.description }
    </div>
  </article>
)

export default ListItem;