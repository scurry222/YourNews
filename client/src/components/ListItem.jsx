import React from 'react';
import styled from 'styled-components';

import Collapsable from 'react-collapsable';

const Article = styled.article`
  margin: 2rem;
  padding: 1rem;
  background-color: #f4f1eb;
  border-radius: 0.3rem;
`;

const ArticleImage = styled.img`
  width: 100%;
  min-width: 15rem;
  min-height: 8rem;
`;

const ArticleTitle = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
`;

const ArticleDescription = styled.div`
  padding: 2rem 0;
  font-size: 1.2rem;
`;

const ArticleContent = styled.a`
`

const ArticleLink = styled.a`
`

const ListItem = ({ article }) => {

  return (
      <Article>
        {
          article.urlToImage &&
          <ArticleImage
            src={article.urlToImage} 
            alt="Missing Image"/>
        }
        <ArticleTitle>
          { article.title }
        </ArticleTitle>
        <ArticleDescription>
          { article.description }
        </ArticleDescription>
        <ArticleContent>{ article.content && article.content.split('[')[0] }</ArticleContent>
        <br />
        <ArticleLink href={article.url}> Read More </ArticleLink>
      </Article>
  )
}
export default ListItem;