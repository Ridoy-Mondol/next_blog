"use client"
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCookie } from 'cookies-next';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [singlePost, setSinglePost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(false);
  const [author, setAuthor] = useState('');
  const token = getCookie('token2');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
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
          setPosts(data.result);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(`Error fetching posts: ${error.message}`);
      }
    };

    fetchPosts();
  }, [token]);

  useEffect(() => {
    if (!author) {
      setLoading2(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/profile/${author}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setUser(data.result);
        }
        setLoading2(false);
      } catch (error) {
        setLoading2(false);
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [author]);

  const fetchSinglePost = async (id) => {
    try {
      const response = await fetch(`/api/users/blog/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setSinglePost(data.result);
        return data.result;
      } else {
        throw new Error(`Error fetching post: ${data.message}`);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deletePost = (id) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
  };

  return (
    <PostsContext.Provider value={{ posts, loading, author, deletePost, fetchSinglePost, singlePost, user, loading2 }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
