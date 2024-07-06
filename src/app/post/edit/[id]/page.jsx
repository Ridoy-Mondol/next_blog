"use client"
import React, { useState, useEffect, useRef, useMemo  } from 'react';
import 'draft-js/dist/Draft.css';
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getCookie } from 'cookies-next';
import { toast } from "react-toastify";
import { usePosts } from '@/app/context/postContext';
import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });


function Page({params}) {
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsloading] = useState (false);
  const {id} = params;
  const editor = useRef(null);
  const { getSinglePost, singlePost } = usePosts();
  useEffect(() => {
    async function fetchData() {
      try {
        await getSinglePost(id);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    }
  
    fetchData();
  }, [id]);

  useEffect(() => {
    setTitle(singlePost?.title);
    setBlog(singlePost?.blog || '');
    setCategory(singlePost?.category || '');
  }, [singlePost]);

  const [title, setTitle] = useState('');
  const [blog, setBlog] = useState('');
  const [category, setCategory] = useState('');
  const [image1, setImage1] = useState(null);

  const [errors, setErrors] = useState({
    title: '',
    blog: '',
    largeBlog: '',
    largeImage: '',
  });


  const handleTitleChange = (event) => {
    const { value } = event.target;
    setTitle(value);
  };

  const handleBlogChange = (value) => {
    setBlog(value);
  };
  
  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setCategory(value);
  };


  const handleImage1Change = (event) => {
    const file = event.target.files[0];
    setImage1(file);
  };
 

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body.textContent || "").replace(/\s+/g, '');
  };

  
  const handleSubmit = async () => {
    const newErrors = {};
    const formData = new FormData();
    title && formData.append('title', title);
    blog && formData.append('blog', blog);
    category && formData.append('category', category);
    image1 && formData.append('image1', image1);
    
    const trimmedTitle = title.replace(/\s+/g, '');
    if (trimmedTitle.length > 0 && (trimmedTitle.length <25 || trimmedTitle.length > 60) ) {
      newErrors.title = 'Title must be between 25 and 60 characters';
    }
    if (stripHtml(blog).length > 0 && stripHtml(blog).length < 500) {
      newErrors.emptyblog = 'Blog must be at least 500 characters long';
    }
    // if (new Blob([blog]).size > 500000) {
    //   toast.error("Blog content is too large");
    //   newErrors.largeBlog = "Blog content is too large";
    // }
    // if (image1 && image1.size > 2000000) {
    //   toast.error("Image is too large");
    //   newErrors.largeImage = "Image is too large";
    // }
    
    const token = getCookie('token2');
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsloading(true);
      try {
        const res = await fetch(`/api/users/blog/${id}`, {
          method: 'PATCH',
          headers: headers,
          body: formData,
        });
        const responseData = await res.json();
        if (res.ok) {
          setErrors({});
          toast.success("Blog updated successfully");
          setTimeout(() => {
            window.location.href = '/articles';
          }, 1000);
        } else {
          console.error('Error submitting form:', res.status, res.statusText);
          toast.error(responseData.error || "Something went wrong. Please try again");
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error("Something went wrong. Please try again");
      }
      setIsloading(false);
    }
  };

  const handleDiscard = () => {
    setTitle('');
    setBlog('');
    setCategory('');
    setImage1(null);
    setErrors({});
    setEditorState(EditorState.createEmpty());
  };

  const config = useMemo(() => ({
    readonly: false,
    placeholder: '',
    toolbar: true,
    uploader: {
      insertImageAsBase64URI: true
    }
  }), []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-center"></div>
          <div className="spinner-text">Loading...</div>
        </div>
      </div>
    );
    }

  return (
    <>
    <Navbar />
    <div className='create-div'>
    {isLoading && (
  <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 py-2 px-4 rounded-md shadow-md z-50 flex items-center">
    <div className="spinner spinner-2 mr-2"></div>
    <span className="text-sm font-medium text-white">Processing...</span>
  </div>
)}
      <div className='input-div'>
        <h3 className='input-title font-bold'>
          Write your title here in 25-60 characters
        </h3>
        <input type='text' name='title' placeholder='Title' autoComplete='off' className='blog-input my-3' value={title} onChange={handleTitleChange} /><br />
        {errors.title && <span className="error-message">{errors.title}</span>}
        
        
      </div>

     
        <div className='input-div'>
          <h3 className='input-title font-bold mb-3'>
            Write your blog in minimum 500 characters
          </h3>
            <JoditEditor
			      ref={editor}
			      value={blog}
			      config={config}
			      tabIndex={1}  
			      onChange={handleBlogChange}
            className='jodit'
            />
          {errors.blog && <span className="error-message">{errors.blog}</span>}
        </div>
      

      
        <div className='input-div'>
          <h3 className='input-title font-bold'>
            Select a category
          </h3>
          <select
            name="category"
            id="category"
            className="blog-input my-3"
            required
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">Category</option>
            <option value="Adventure">Adventure</option>
            <option value="Travel">Travel</option>
            <option value="Sports">Sports</option>
            <option value="Technology">Technology</option>
            <option value="Branding">Branding</option>
          </select>
        </div>
      

      
        <div className='input-div'>
          <h3 className='input-title font-bold'>
            Choose an image for your blog
          </h3>
          <input
            type="file"
            name="image1"
            id="blogImage1"
            accept="image/*"
            className="blog-input my-3"
            required
            onChange={handleImage1Change}
          />
        </div>
      
      
        <div>
          <button type='button' className='input-btn post-btn' onClick={handleSubmit}>
            Update blog
          </button>
          <button type='button' className='input-btn discard-btn' onClick={handleDiscard}>
            Discard blog
          </button>
        </div> 

    </div>
    <Footer />
    </>
  );
}

export default Page;
