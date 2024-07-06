"use client"
import React, { useState, useRef, useMemo } from 'react';
import 'draft-js/dist/Draft.css';
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getCookie } from 'cookies-next';
import { toast } from "react-toastify";
import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

function Page() {
  const [title, setTitle] = useState('');
  const [blog, setBlog] = useState('');
  const [category, setCategory] = useState('');
  const [image1, setImage1] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsloading] = useState (false);
  const [errors, setErrors] = useState({
    title: '',
    emptytitle: '',
    blog: '',
    emptyblog: '',
    category: '',
    image: '',
    largeBlog: '',
    largeImage: '',
  });
  const editor = useRef(null);

  const token = getCookie('token2');

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

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    const formData = new FormData();
    formData.append('title', title);
    formData.append('blog', blog);
    formData.append('category', category);
    formData.append('image1', image1);

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    
    const trimmedTitle = title.replace(/\s+/g, '');
    if (trimmedTitle.length === 0) {
      newErrors.emptytitle = 'Title is required.';
    }
    if ((trimmedTitle.length > 0 && trimmedTitle.length < 25) || trimmedTitle.length > 60) {
      newErrors.title = 'Title should be between 25 and 60 characters.';
    }
    if (stripHtml(blog).length === 0) {
      newErrors.emptyblog = 'Blog is required.';
    } else if (stripHtml(blog).length < 500) {
      newErrors.blog = 'Blog must be at least 500 characters long.';
    }
    if (!category) {
      newErrors.category = 'Category is required.';
    }
    if (!image1) {
      newErrors.image = 'Image is required.';
    }
    if (new Blob([blog]).size > 2000000) {
      toast.error("Blog content is too large");
      newErrors.largeBlog = 'Blog content is too large.';
    }
    if (image1 && image1.size > 2000000) {
      toast.error("Image is too large");
      newErrors.largeImage = 'Image is too large.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsloading(true);
      try {
        const res = await fetch('/api/users/blog', {
          method: 'POST',
          headers: headers,
          body: formData,
        });
        console.log("successfully submitted");
        const responseData = await res.json();
        // if (res.status === 200) {
        //   toast.success("Blog created successfully");
        //   setTimeout(() => {
        //     window.location.href = '/articles';
        //   }, 1000);          
        // } else if (res.status === 413) {
        //   toast.error(responseData.error);
        // } else {
        //   console.error('Error submitting form:', res.status, res.statusText);
        //   toast.error(responseData.error || "Something went wrong. Please try again");
        // }

        if (res.ok) {
          toast.success("Blog created successfully");
          setTimeout(() => {
            window.location.href = '/articles';
          }, 1000);          
        } else {
          console.error('Error submitting form:', response.status, response.statusText);
          toast.error(responseData.error || "Problem updating blog. Please try again");
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
    setCurrentStep(1);
    setErrors({});
  };

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Write blog here...',
    toolbar: true,
    uploader: {
      insertImageAsBase64URI: true
    }
  }), []);

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
        {(errors.emptytitle && !errors.title) && <span className="error-message">{errors.emptytitle}</span>}
        {errors.title && <span className="error-message">{errors.title}</span>}
        {currentStep === 1 && (
          <button type='button' className={title.replace(/\s+/g, '').length >= 25 && title.replace(/\s+/g, '').length <= 60 ? 'input-btn' : 'input-btn hidden'} onClick={handleNext}>
            Next
          </button>
        )}
      </div>

      {currentStep >= 2 && (
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

          {errors.emptyblog && <span className="error-message">{errors.emptyblog}</span>}
          {errors.blog && <span className="error-message">{errors.blog}</span>}
          {currentStep === 2 && (
          <button
              type='button'
              className={stripHtml(blog).length >= 500 ? 'input-btn mt-3' : 'input-btn hidden'}
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      )}

      {currentStep >= 3 && (
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
          {errors.category && <span className="error-message">{errors.category}</span>}
          {currentStep === 3 && (
            <button type='button' className={category !== '' ? 'input-btn' : 'input-btn hidden'} onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      )}

      {currentStep >= 4 && (
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
          {errors.image && <span className="error-message">{errors.image}</span>}
          {currentStep === 4 && (
            <button type='button' className={image1 ? 'input-btn' : 'input-btn hidden'} onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      )}

      {(currentStep === 5) && (
        <div>
          <button type='button' className='input-btn post-btn' onClick={handleSubmit}>
            Post your blog
          </button>
          <button type='button' className='input-btn discard-btn' onClick={handleDiscard}>
            Discard blog
          </button>
        </div>
      )}

      <div></div>
    </div>
    <Footer />
    </>
  );
}

export default Page;
