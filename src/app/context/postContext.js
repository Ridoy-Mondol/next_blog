"use client"
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCookie } from 'cookies-next';


const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [singlePost, setSinglePost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState('');


  async function fetchPosts() {
    const token = getCookie('token2');
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    
    try {
      const response = await fetch('/api/users/blog', {
        method: 'GET',
        headers: headers,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.success) {
        setAuthor(data.userId);
        return data.result;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(`Error fetching posts: ${error.message}`);
    }
  }

  async function fetchSinglePost(id) {
    try {
      const response = await fetch(`/api/users/blog/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        return data.result;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  async function getUser(authorId) {
    try {
      const response = await fetch(`/api/users/profile/${authorId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        return data.result;
      } else {
        return {};
      }
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  const loadPosts = async () => {
    try {
      const result = await fetchPosts();
      setPosts(result);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getSinglePost = async (id) => {
    try {
      const result = await fetchSinglePost(id);
      setSinglePost(result);
      return result;
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePost = (id) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
  };

  useEffect(() => {
    loadPosts();    
  }, []);

  return (
    <PostsContext.Provider value={{ posts, loading, author, deletePost, error, loadPosts, getSinglePost, singlePost, getUser }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
