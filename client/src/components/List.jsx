import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ListItem from './ListItem.jsx';


const NewsListContainer = styled.div`
  // margin: 5rem 25rem;
  width: 100%;
  height: 97%;
  top: 0;
`

const ArticleDivider = styled.div`
`;


const NewsList = ({ articles, total}) => {
  const [feed, setFeed] = useState([]);
  useEffect(() => {
    setFeed(articles)
  }, [articles])
  return (
    <NewsListContainer>
      {
        !total
        ? <div>No subscriptions found. Browse through recommended tags or use the searchbar to get started.</div>
        : null
      }
      
      {
        feed.map((article, i) => 
          <div key={i}>
            <ListItem article={ article }/>
            <ArticleDivider />
          </div>
        
        )
      }
    </NewsListContainer>
  )
}


export default NewsList;
