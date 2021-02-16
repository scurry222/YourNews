import React from 'react';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';

import TagEntry from './TagEntry.jsx';

const TagListContainer = styled.div`
    display: flex;
    align-items: center;
    width: 40%;
    flex-wrap: wrap;
    justify-content: center;
`;

const TagList = ({ tags, removeTag }) => {
  return (
    <TagListContainer>
      {
        tags.map((tag, i) =>
            <TagEntry tag={tag} key={i} removeTag={removeTag} />
        )
      }
    </TagListContainer>
  )
}

export default TagList;