import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PostSchemaTypes, editPost } from '../store/postSlice';
import axios from 'axios';
import { BASE_API_URL } from '../utils/api';
import styled from 'styled-components';

interface PropTypes {
  post: PostSchemaTypes;
  handleDeletedItem?: (postId: string) => void;
}

const PostDeleteUpdate: FC<PropTypes> = ({ handleDeletedItem, post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDisplaySetting, setIsDisplayShowSetting] = useState(false);

  const editHandler = () => {
    dispatch(editPost({ isEditing: true, post: post }));
    navigate('/create-post');
  };

  const deleteHandler = () => {
    // const userId = localStorage.getItem('userId');
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    axios
      .delete(`${BASE_API_URL}/feed/delete-post/${post._id}`, config)
      .then((res) => {
        if (res.status === 200) {
          if (handleDeletedItem) {
            handleDeletedItem(post._id);
          } else {
            navigate('/');
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDisplayingSettings = () => {
    setIsDisplayShowSetting((prevState) => !prevState);
  };

  return (
    <Container onClick={handleDisplayingSettings}>
      <div className="setting-dots" />
      {isDisplaySetting && (
        <div className="post-settings__items">
          <div className="edit" onClick={editHandler}>
            Edit
          </div>
          <div className="delete" onClick={deleteHandler}>
            Delete
          </div>
        </div>
      )}
    </Container>
  );
};

export default PostDeleteUpdate;

const Container = styled.div`
  padding: 0.9rem;
  position: relative;
  border-radius: 50%;
  /* border: 1px solid #000; */
  cursor: pointer;
  transition: 200ms background-color ease-in-out;
  &:hover {
    background-color: #fff;
  }
  .setting-dots {
    --dot-size: 0.2rem;
    --dot-color: ;
    width: var(--dot-size);
    height: var(--dot-size);
    border-radius: 50%;
    background-color: #000;
    &::after,
    &::before {
      content: '';
      width: var(--dot-size);
      height: var(--dot-size);
      border-radius: 50%;
      background-color: #000;
      position: absolute;
      top: 25%;
      transform: translateY(-50%);
    }
    &::after {
      /* top: 100%;
              transform: translateY(-100%); */
      top: 75%;
    }
  }
  .post-settings__items {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #ffffff;
    .edit,
    .delete {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem 1rem;
      transition: 200ms all ease-in-out;
      &:hover {
        background-color: var(--primary-purple);
        color: #fff;
      }
    }
  }
`;
