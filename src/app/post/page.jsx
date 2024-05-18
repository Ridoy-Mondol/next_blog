// "use client"
// import React, { useState } from 'react';
// import { Editor, EditorState, RichUtils } from 'draft-js';
// import 'draft-js/dist/Draft.css';
// import axios from 'axios';

// function Page() {
//   const [isEditorFocused, setIsEditorFocused] = useState(false);
//   const [title, setTitle] = useState('');
//   const [blog, setBlog] = useState('');
//   const [category, setCategory] = useState('');
//   const [name, setName] = useState('');
//   const [image1, setImage1] = useState(null);
//   const [image2, setImage2] = useState('');
//   const [currentStep, setCurrentStep] = useState(1);
//   const [errors, setErrors] = useState({
//     title: '',
//     emptytitle: '',
//     blog: '',
//     emptyblog: '',
//     category: '',
//     image: '',
//     name: ''
//   });
//   const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

//   const handleTitleChange = (event) => {
//     const { value } = event.target;
//     setTitle(value);
//   };

//   const handleBlogChange = (editorState) => {
//     setEditorState(editorState);
//     const content = editorState.getCurrentContent();
//     setBlog(content.getPlainText());
//   };

//   const handleStyleChange = (style) => {
//     setEditorState(RichUtils.toggleInlineStyle(editorState, style));
//   };

//   const handleCategoryChange = (event) => {
//     const { value } = event.target;
//     setCategory(value);
//   };

//   const handleNameChange = (event) => {
//     const { value } = event.target;
//     setName(value);
//   };

//   const handleImage1Change = (event) => {
//     const file = event.target.files[0];
//     setImage1(file);
//   };

//   const handleImage2Change = (event) => {
//     const file = event.target.files[0];
//     setImage2(file);
//   };

//   const handleNext = () => {
//     if (currentStep === 4 && !image1) {
//       setErrors({ ...errors, image: 'Please choose an image for the mandatory field.' });
//       return;
//     }
//     setCurrentStep(currentStep + 1);
//   };

// const handleSubmit = async () => {
//   const newErrors = {};
//   const formData = new FormData();
//   formData.append('title', title);
//   formData.append('blog', blog);
//   formData.append('category', category);
//   formData.append('name', name);
//   // formData.append('image1', image1);
//   // formData.append('image2', image2);

//   if ((title.length < 25 || title.length > 60) && title.length > 0) {
//     newErrors.title = 'Title length must be between 25 and 60 characters.';
//   }
//   if (title.length === 0) {
//     newErrors.emptytitle = 'Title is required.';
//   }

//   if (blog.length < 500 && blog.length > 0) {
//     newErrors.blog = 'Blog must be at least 500 characters long.';
//   }
//   if (blog.length === 0) {
//     newErrors.emptyblog = 'Blog is required.';
//   }

//   if (!category) {
//     newErrors.category = 'Category is required.';
//   }

//   if (!image1) {
//     newErrors.image = 'Image is required.';
//   }

//   if (!name) {
//     newErrors.name = 'Name is required.';
//   }

//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//   } else {
//     try {

//       const res = await fetch('/api/users/blog', {
//         method: 'POST',
//         body: formData
//       });

//       // const res = await axios.post('/api/users/blog', formData, {
//       //   headers: {
//       //     'Content-Type': 'multipart/form-data'
//       //   }
//       // });
//       console.log("successfully submitted");
//       if (res.status === 200) {
//         console.log('Form submitted successfully');
//         setTitle('');
//         setBlog('');
//         setCategory('');
//         setName('');
//         setImage1(null);
//         setImage2('');
//         setCurrentStep(1);
//         setErrors({});
//         setEditorState(EditorState.createEmpty());
//       } else {
//         console.error('Error submitting form:', res.status, res.statusText);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     }
//   }
// };


//   const handleDiscard = () => {
//     setTitle('');
//     setBlog('');
//     setCategory('');
//     setName('');
//     setImage1(null);
//     setImage2('');
//     setCurrentStep(1);
//     setErrors({});
//     setEditorState(EditorState.createEmpty());
//   };

//   return (
//     <div className='create-div'>
//       <div className='input-div'>
//         <h3 className='input-title font-bold'>
//           Write your title here in 25-60 characters
//         </h3>
//         <input type='text' placeholder='Title' className='blog-input my-3' value={title} onChange={handleTitleChange} /><br />
//         {errors.title && <span className="error-message">{errors.title}</span>}
//         {errors.emptytitle && <span className="error-message">{errors.emptytitle}</span>}
//         {currentStep === 1 && (
//           <button type='button' className={title.length >= 25 && title.length <= 60 ? 'input-btn' : 'input-btn hidden'} onClick={handleNext}>
//             Next
//           </button>
//         )}
//       </div>

//       {currentStep >= 2 && (
//         <div className='input-div'>
//           <h3 className='input-title font-bold'>
//             Write your blog in minimum 500 characters
//           </h3>
//             <div className="editor-toolbar my-3">
//               <button onClick={() => handleStyleChange('BOLD')}><b>B</b></button>
//               <button onClick={() => handleStyleChange('ITALIC')}><i>I</i></button>
//               <button onClick={() => handleStyleChange('UNDERLINE')}><u>U</u></button>
//             </div>
//             <div 
//             className={isEditorFocused ? "blog-input blog-input-2 my-3 focused" : "blog-input blog-input-2 my-3"}
//             onFocus={() => setIsEditorFocused(true)}
//             onBlur={() => setIsEditorFocused(false)}>
//             <Editor
//               editorState={editorState}
//               onChange={handleBlogChange}
//               placeholder="Blog"
//               editorClassName="blog-input blog-input-2 my-3 editor-input"
//             />
//             </div>
//           {errors.blog && <span className="error-message">{errors.blog}</span>}
//           {errors.emptyblog && <span className="error-message">{errors.emptyblog}</span>}
//           {currentStep === 2 && (
//             <button type='button' className={blog.length >= 500 ? 'input-btn mt-3' : 'input-btn hidden'} onClick={handleNext}>
//               Next
//             </button>
//           )}
//         </div>
//       )}

// {currentStep >= 3 && (
//         <div className='input-div'>
//           <h3 className='input-title font-bold'>
//             Select a category
//           </h3>
//           <select
//             id="category"
//             className="blog-input my-3"
//             required
//             value={category}
//             onChange={handleCategoryChange}
//           >
//             <option value="">Category</option>
//             <option value="Adventure">Adventure</option>
//             <option value="Travel">Travel</option>
//             <option value="Sports">Sports</option>
//             <option value="Technology">Technology</option>
//             <option value="Branding">Branding</option>
//           </select>
//           {errors.category && <span className="error-message">{errors.category}</span>}
//           {currentStep === 3 && (
//             <button type='button' className={category !== '' ? 'input-btn' : 'input-btn hidden'} onClick={handleNext}>
//               Next
//             </button>
//           )}
//         </div>
//       )}

//       {currentStep >= 4 && (
//         <div className='input-div'>
//           <h3 className='input-title font-bold'>
//             Choose an image for your blog
//           </h3>
//           <input
//             type="file"
//             id="blogImage1"
//             accept="image/*"
//             className="blog-input my-3"
//             required
//             onChange={handleImage1Change}
//           />
//           {errors.image && <span className="error-message">{errors.image}</span>}
//           {currentStep === 4 && (
//             <button type='button' className={image1 ? 'input-btn' : 'input-btn hidden'} onClick={handleNext}>
//               Next
//             </button>
//           )}
//         </div>
//       )}

//       {currentStep >= 5 && (
//         <div className='input-div'>
//           <h3 className='input-title font-bold'>
//             Write your name
//           </h3>
//           <input type='text' placeholder='Name' className='blog-input my-3' value={name} onChange={handleNameChange} /><br />
//           {errors.name && <span className="error-message">{errors.name}</span>}
//           {currentStep === 5 && (
//             <button type='button' className={name !== '' ? 'input-btn' : 'input-btn hidden'} onClick={handleNext}>
//               Next
//             </button>
//           )}
//         </div>
//       )}

//       {currentStep >= 6 && (
//         <div className='input-div'>
//           <h3 className='input-title font-bold'>
//             Choose your image(optional)
//           </h3>
//           <input
//             type="file"
//             id="blogImage2"
//             accept="image/*"
//             className="blog-input my-3"
//             onChange={handleImage2Change}
//           />
//         </div>
//       )}

//       {(currentStep === 7 || currentStep === 6) && (
//         <div>
//           <button type='button' className='input-btn post-btn' onClick={handleSubmit}>
//             Post your blog
//           </button>
//           <button type='button' className='input-btn discard-btn' onClick={handleDiscard}>
//             Discard blog
//           </button>
//         </div>
//       )}
     
//      <div>
//      </div>
//     </div>
//   );
// }

// export default Page;









// "use client"
// import React, { useState } from 'react';
// import { Editor, EditorState, RichUtils } from 'draft-js';
// import 'draft-js/dist/Draft.css';
// import Link from 'next/link'
// import { useRouter } from 'next/router';

// function Page() {
//   // const router = useRouter();
//   const [isEditorFocused, setIsEditorFocused] = useState(false);
//   const [title, setTitle] = useState('');
//   const [blog, setBlog] = useState('');
//   const [category, setCategory] = useState('');
//   const [name, setName] = useState('');
//   const [image1, setImage1] = useState(null);
//   const [image2, setImage2] = useState('');
//   const [currentStep, setCurrentStep] = useState(1);
//   const [errors, setErrors] = useState({
//     title: '',
//     emptytitle: '',
//     blog: '',
//     emptyblog: '',
//     category: '',
//     image: '',
//     name: ''
//   });
//   const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

//   const token = localStorage.getItem('token');

//   const handleTitleChange = (event) => {
//     const { value } = event.target;
//     setTitle(value);
//   };

//   const handleBlogChange = (editorState) => {
//     setEditorState(editorState);
//     const content = editorState.getCurrentContent();
//     setBlog(content.getPlainText());
//   };

//   const handleStyleChange = (style) => {
//     setEditorState(RichUtils.toggleInlineStyle(editorState, style));
//   };

//   const handleCategoryChange = (event) => {
//     const { value } = event.target;
//     setCategory(value);
//   };

//   const handleNameChange = (event) => {
//     const { value } = event.target;
//     setName(value);
//   };

//   const handleImage1Change = (event) => {
//     const file = event.target.files[0];
//     setImage1(file);
//   };

//   const handleImage2Change = (event) => {
//     const file = event.target.files[0];
//     setImage2(file);
//   };

//   const handleNext = () => {
//     if (currentStep === 4 && !image1) {
//       setErrors({ ...errors, image: 'Please choose an image for the mandatory field.' });
//       return;
//     }
//     setCurrentStep(currentStep + 1);
//   };

//   const handleSubmit = async () => {
//     const newErrors = {};
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('blog', blog);
//     formData.append('category', category);
//     formData.append('name', name);
//     formData.append('image1', image1);
//     image2 && formData.append('image2', image2);

//     const headers = new Headers();
//     headers.append('Authorization', `Bearer ${token}`);

//     if (title.length === 0) {
//       newErrors.emptytitle = 'Title is required.';
//     }
//     if (!name) {
//       newErrors.name = 'Name is required.';
//     }
//     if (blog.length === 0) {
//       newErrors.emptyblog = 'Blog is required.';
//     } else if (blog.length < 500) {
//       newErrors.blog = 'Blog must be at least 500 characters long.';
//     }
//     if (!category) {
//       newErrors.category = 'Category is required.';
//     }
//     if (!image1) {
//       newErrors.image = 'Image is required.';
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//     } else {
//       try {
//         const res = await fetch('/api/users/blog', {
//           method: 'POST',
//           headers: headers,
//           body: formData,
//         });
//         console.log("successfully submitted");
//         if (res.status === 200) {
//           console.log('Form submitted successfully');
//           window.location.href = '/articles';
//         } else {
//           console.error('Error submitting form:', res.status, res.statusText);
//         }
//       } catch (error) {
//         console.error('Error submitting form:', error);
//       }
//     }
//   };

//   const handleDiscard = () => {
//     setTitle('');
//     setBlog('');
//     setCategory('');
//     setName('');
//     setImage1(null);
//     setImage2('');
//     setCurrentStep(1);
//     setErrors({});
//     setEditorState(EditorState.createEmpty());
//   };

//   return (
//     <div className='create-div'>
//       <div className='input-div'>
//         <h3 className='input-title font-bold'>
//           Write your title here in 25-60 characters
//         </h3>
//         <input type='text' name='title' placeholder='Title' className='blog-input my-3' value={title} onChange={handleTitleChange} /><br />
//         {errors.emptytitle && <span className="error-message">{errors.emptytitle}</span>}
//         {currentStep === 1 && (
//           <button type='button' className={title.length >= 25 && title.length <= 60 ? 'input-btn' : 'input-btn hidden'} onClick={handleNext}>
//             Next
//           </button>
//         )}
//       </div>

//       {currentStep >= 2 && (
//         <div className='input-div'>
//           <h3 className='input-title font-bold'>
//             Write your blog in minimum 500 characters
//           </h3>
//           <div className="editor-toolbar my-3">
//             <button onClick={() => handleStyleChange('BOLD')}><b>B</b></button>
//             <button onClick={() => handleStyleChange('ITALIC')}><i>I</i></button>
//             <button onClick={() => handleStyleChange('UNDERLINE')}><u>U</u></button>
//           </div>
//           <div
//             className={isEditorFocused ? "blog-input blog-input-2 my-3 focused" : "blog-input blog-input-2 my-3"}
//             onFocus={() => setIsEditorFocused(true)}
//             onBlur={() => setIsEditorFocused(false)}>
//             <Editor
//               editorState={editorState}
//               onChange={handleBlogChange}
//               placeholder="Blog"
//               editorClassName="blog-input blog-input-2 my-3 editor-input"
//             />
//           </div>
//           {errors.emptyblog && <span className="error-message">{errors.emptyblog}</span>}
//           {errors.blog && <span className="error-message">{errors.blog}</span>}
//           {currentStep === 2 && (
//             <button type='button' className={blog.length >= 500 ? 'input-btn mt-3' : 'input-btn hidden'} onClick={handleNext}>
//               Next
//             </button>
//           )}
//         </div>
//       )}

//       {currentStep >= 3 && (
//         <div className='input-div'>
//           <h3 className='input-title font-bold'>
//             Select a category
//           </h3>
//           <select
//             name="category"
//             id="category"
//             className="blog-input my-3"
//             required
//             value={category}
//             onChange={handleCategoryChange}
//           >
//             <option value="">Category</option>
//             <option value="Adventure">Adventure</option>
//             <option value="Travel">Travel</option>
//             <option value="Sports">Sports</option>
//             <option value="Technology">Technology</option>
//             <option value="Branding">Branding</option>
//           </select>
//           {errors.category && <span className="error-message">{errors.category}</span>}
//           {currentStep === 3 && (
//             <button type='button' className={category !== '' ? 'input-btn' : 'input-btn hidden'} onClick={handleNext}>
//               Next
//             </button>
//           )}
//         </div>
//       )}

//       {currentStep >= 4 && (
//         <div className='input-div'>
//           <h3 className='input-title font-bold'>
//             Choose an image for your blog
//           </h3>
//           <input
//             type="file"
//             name="image1"
//             id="blogImage1"
//             accept="image/*"
//             className="blog-input my-3"
//             required
//             onChange={handleImage1Change}
//           />
//           {errors.image && <span className="error-message">{errors.image}</span>}
//           {currentStep === 4 && (
//             <button type='button' className={image1 ? 'input-btn' : 'input-btn hidden'} onClick={handleNext}>
//               Next
//             </button>
//           )}
//         </div>
//       )}

//       {currentStep >= 5 && (
//         <div className='input-div'>
//           <h3 className='input-title font-bold'>
//             Write your name
//           </h3>
//           <input type='text' name='name' placeholder='Name' className='blog-input my-3' value={name} onChange={handleNameChange} /><br />
//           {errors.name && <span className="error-message">{errors.name}</span>}
//           {currentStep === 5 && (
//             <button type='button' className={name !== '' ? 'input-btn' : 'input-btn hidden'} onClick={handleNext}>
//               Next
//             </button>
//           )}
//         </div>
//       )}

//       {currentStep >= 6 && (
//         <div className='input-div'>
//           <h3 className='input-title font-bold'>
//             Choose your image (optional)
//           </h3>
//           <input
//             type="file"
//             name="image2"
//             id="blogImage2"
//             accept="image/*"
//             className="blog-input my-3"
//             onChange={handleImage2Change}
//           />
//         </div>
//       )}

//       {(currentStep === 7 || currentStep === 6) && (
//         <div>
//           <button type='button' className='input-btn post-btn' onClick={handleSubmit}>
//             Post your blog
//           </button>
//           <button type='button' className='input-btn discard-btn' onClick={handleDiscard}>
//             Discard blog
//           </button>
//         </div>
//       )}

//       <div></div>
//     </div>
//   );
// }

// export default Page;







"use client"
import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import TokenValidation from "@/app/hooks/TokenValidation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

function Page() {
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [title, setTitle] = useState('');
  const [blog, setBlog] = useState('');
  const [category, setCategory] = useState('');
  const [image1, setImage1] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({
    title: '',
    emptytitle: '',
    blog: '',
    emptyblog: '',
    category: '',
    image: ''
  });
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const token = localStorage.getItem('token');

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

    if (title.length === 0) {
      newErrors.emptytitle = 'Title is required.';
    }
    if ((title.length > 0 && title.length < 25) || title.length > 60) {
      newErrors.title = 'Title should be between 25 and 60 characters.';
    }
    if (blog.length === 0) {
      newErrors.emptyblog = 'Blog is required.';
    } else if (blog.length < 500) {
      newErrors.blog = 'Blog must be at least 500 characters long.';
    }
    if (!category) {
      newErrors.category = 'Category is required.';
    }
    if (!image1) {
      newErrors.image = 'Image is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const res = await fetch('/api/users/blog', {
          method: 'POST',
          headers: headers,
          body: formData,
        });
        console.log("successfully submitted");
        if (res.status === 200) {
          console.log('Form submitted successfully');
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
    setCurrentStep(1);
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
        {(errors.emptytitle && !errors.title) && <span className="error-message">{errors.emptytitle}</span>}
        {errors.title && <span className="error-message">{errors.title}</span>}
        {currentStep === 1 && (
          <button type='button' className={title.length >= 25 && title.length <= 60 ? 'input-btn' : 'input-btn hidden'} onClick={handleNext}>
            Next
          </button>
        )}
      </div>

      {currentStep >= 2 && (
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
          {errors.emptyblog && <span className="error-message">{errors.emptyblog}</span>}
          {errors.blog && <span className="error-message">{errors.blog}</span>}
          {currentStep === 2 && (
            <button type='button' className={blog.length >= 500 ? 'input-btn mt-3' : 'input-btn hidden'} onClick={handleNext}>
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

export default TokenValidation(Page);

