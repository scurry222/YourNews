import React, { useState, useEffect } from 'react'; 
import styled from 'styled-components';

const TagListContainer = styled.div`
    display: flex;
    width: 100%;
`;
const Tag = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background: whitesmoke;
    border: 1px solid grey;
    border-radius: 2rem;
    padding: 0.5rem 2rem;
    font-weight: bolder;
    margin: 1rem;
`
const RemoveTagButton = styled.button`
    position: absolute;
    right: 0.5rem;
    background: lightskyblue;
    color: #fff;
    font-weight: bold;
    font-family: serif;
    border: none;
    border-radius: 2rem;
`;

const TagList = ({ tags, removeTag }) => {
    const [inHover, setHover] = useState(false);
    return (
        <TagListContainer>
        {
            tags.map((tag, i) => 
                <Tag
                    key={i}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    { tag }
                    {
                        inHover &&
                        <RemoveTagButton onClick={(e) => removeTag(e.target)}>X</RemoveTagButton>
                    }
                </Tag>
            )
        }
        </TagListContainer>    
    )
}

export default TagList;