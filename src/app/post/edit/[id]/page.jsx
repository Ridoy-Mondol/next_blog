"use client"
import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import TokenValidation from "@/app/hooks/TokenValidation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

async function getProducts(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/users/blog/${id}`);
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
  const {id} = params;
  // const token = localStorage.getItem('token');
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts(id);
        setItem(data);
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
    
    if (item && item.blog) {
      try {
        setEditorState(EditorState.createWithContent(ContentState.createFromText(item.blog)));
      } catch (error) {
        console.error('Error setting editor content:', error);
      }
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [item]);

  const [isEditorFocused, setIsEditorFocused] = useState(false);
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
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());


  const handleTitleChange = (event) => {
    const { value } = event.target;
    setTitle(value);
  };

  const handleBlogChange = (editorState) => {
    setEditorState(editorState);
    const content = editorState.getCurrentContent();
    setBlog(content.getPlainText());
  };
  

  const handleStyleChange = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setCategory(value);
  };


  const handleImage1Change = (event) => {
    const file = event.target.files[0];
    setImage1(file);
  };


  
  const handleSubmit = async () => {
    const newErrors = {};
    const formData = new FormData();
    title && formData.append('title', title);
    blog && formData.append('blog', blog);
    category && formData.append('category', category);
    image1 && formData.append('image1', image1);

    if (title.length > 0 && (title.length <25 || title.length > 60) ) {
      newErrors.title = 'Title must be between 25 and 60 characters';
    }
    if (blog.length > 0 && blog.length < 500) {
      newErrors.blog = 'Blog must be at least 500 characters long.';
    }
    
    const token = (typeof localStorage !== 'undefined') && localStorage.getItem('token');
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
          <h3 className='input-title font-bold'>
            Write your blog in minimum 500 characters
          </h3>
          <div className="editor-toolbar my-3">
            <button onClick={() => handleStyleChange('BOLD')}><b>B</b></button>
            <button onClick={() => handleStyleChange('ITALIC')}><i>I</i></button>
            <button onClick={() => handleStyleChange('UNDERLINE')}><u>U</u></button>
          </div>
          <div
            className={isEditorFocused ? "blog-input blog-input-2 my-3 focused" : "blog-input blog-input-2 my-3"}
            onFocus={() => setIsEditorFocused(true)}
            onBlur={() => setIsEditorFocused(false)}>
            <Editor
              editorState={editorState}
              onChange={handleBlogChange}
              placeholder="Blog"
              editorClassName="blog-input blog-input-2 my-3 editor-input"
            />
          </div>
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

export default TokenValidation(Page);
