"use client"
import React, { useState, useEffect, useRef, useMemo  } from 'react';
import 'draft-js/dist/Draft.css';
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

async function getProducts(id) {
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
    throw new Error(`Error fetching products: ${error.message}`);
  }
}


function Page({params}) {
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const {id} = params;
  const editor = useRef(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts(id);
        setItem(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  
    fetchData();
  }, [id]);

  useEffect(() => {
    setTitle(item.title);
    setBlog(item.blog || '');
    setCategory(item.category || '');
  }, [item]);

  const [title, setTitle] = useState('');
  const [blog, setBlog] = useState('');
  const [category, setCategory] = useState('');
  const [image1, setImage1] = useState(null);

  const [errors, setErrors] = useState({
    title: '',
    emptytitle: '',
    blog: '',
    emptyblog: '',
    category: '',
    image: '',
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
      newErrors.blog = 'Blog must be at least 500 characters long.';
    }
    
    const token = getCookie('token2');
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const res = await fetch(`/api/users/blog/${id}`, {
          method: 'PATCH',
          headers: headers,
          body: formData,
        });
        if (res.status === 200) {
          setErrors({});
          window.location.href = '/articles';
        } else {
          console.error('Error submitting form:', res.status, res.statusText);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
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
      <div className='input-div'>
        <h3 className='input-title font-bold'>
          Write your title here in 25-60 characters
        </h3>
        <input type='text' name='title' placeholder='Title' className='blog-input my-3' value={title} onChange={handleTitleChange} /><br />
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
