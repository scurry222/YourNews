import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styled from 'styled-components';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


const Tag = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border: 1px solid lightgrey;
    border-radius: 2rem;
    padding: 0.5rem 2rem;
    font-weight: bolder;
    margin: 1rem;
    transition: ease 0.5s;
    &:hover {
        border: 1px solid grey;
    }
`
const RemoveTagButton = styled.button`
    position: absolute;
    right: 0.5rem;
    background: #fff;
    color: lightskyblue;
    font-family: Arial;
    border: none;
    border-radius: 2rem;
    &:focus {
        outline: none;
    }
`;

const TagEntry = ({ tag, i, removeTag }) => {
  const [inHover, setHover] = useState(false);

  return (
    <Tag
      key={i}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {tag}
      {
        inHover &&
        <RemoveTagButton onClick={(e) => removeTag(e.target)}><FontAwesomeIcon icon={ faTimes } /></RemoveTagButton>
      }
    </Tag>
  )
}
export default TagEntry;
