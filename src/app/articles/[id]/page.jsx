"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faEllipsisV, faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import userImg from "@/app/Images/user_img.jpg";
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

const determineReadingTime = (length) => {
  if (length > 500 && length < 1000) {
    return 3;
  } else if (length > 1000 && length < 1500) {
    return 4;
  } else if (length > 1500 && length < 2000) {
    return 5;
  } else if (length > 2000 && length < 2500) {
    return 6;
  } else if (length > 2500 && length < 3000) {
    return 7;
  } else if (length > 3000 && length < 3500) {
    return 8;
  } else if (length > 3500 && length < 4000) {
    return 9;
  } else if (length > 4000 && length < 4500) {
    return 10;
  } else if (length > 4500) {
    return 12;
  }
};


function Page({params}) {
  const [item, setItem] = useState([]);
  const [postData, setPostData] = useState([]);
  const [showbox, setShowbox] = useState (false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const {id} = params;

  const token = (typeof localStorage !== 'undefined') && localStorage.getItem('token');

  const Showbox = (_id) => {
    setShowbox(!showbox);
  }


  async function getAllProducts(token) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    try {
      const response = await fetch(`http://localhost:3000/api/users/blog`, {
        method: 'GET',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setAuthor (data.userId);
        return data.result;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }


    useEffect(() => {
      async function fetchData() {
        try {
          const data = await getProducts(id);
          setItem(data);
          setLoading(false);
        } catch (error) {
          setError('Error fetching products');
          console.error('Error fetching products:', error);
        }
      }
    
      fetchData();
    }, [id]);
    
    useEffect(() => {
      async function fetchData() {
        try {
          const data = await getAllProducts(token);
          setPostData(data);
          // setLoading(false);
        } catch (error) {
          // setError('Error fetching products');
          console.error('Error fetching products:', error);
        }
      }
    
      fetchData();
    }, [token]);
   
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    async function deleteItem (id, author) {
      try {
        const response = await fetch(`/api/users/blog/${id}`, {
          method: 'DELETE',
          headers: headers,
        });
        const data = await response.json();
        if (data.success === true) {
          if (author === data.userId) {
          setPostData(prevPosts => prevPosts.filter(post => post._id !== id));
          window.location.href = '/articles';
        }
        } else {
          console.error('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
    }   
    }
    const blogLength = item?.blog?.length ?? 'N/A';
    const readingTime = determineReadingTime(blogLength);
   
  return (
    <>
    <Navbar />
    <div>
        <Image src = {item.image1} alt = "" className='w-100 single-img'
        width='1000' 
        height='1000'
        />
        <div>
          <h1 className='home-heading font-bold popular-head my-3 single-title'>
            {item.title}
          </h1>
          <p className="text-xs text-white text-center home-category single-cate">
            {item.category}
          </p>

          <div className="flex text-s single-blog">
             <div className='flex space-x-2'>
              <div className='single-date'>{item.date?.split('T').at(0)}  <FontAwesomeIcon icon={faMinus} className='ml-2'/> </div>
              <div className='flex space-x-1'>
                <span>{readingTime}</span> 
                <span>minutes</span>
              </div>
              </div>
              
              <div className=''>
              <div className='single-para'>
                {item.blog}
              </div>
              <div className='flex justify-between align-items-center pt-12 pb-16 text-xs'>
                 <div className='flex align-items-center space-x-2'>
                    <Image src = {item.user?.profileImage != null ? item.user.profileImage : userImg} alt='' className='single-user-img'
                    width='100' 
                    height='100'
                    />
                    <div>
                      <p className='font-bold single-author text-capitalize'>{item.user?.name}</p>
                      <p className='author-profession'>
                        Student
                      </p>
                    </div>
                 </div>

                 <div className={`position-absolute list-none editpart2 d-flex flex-column justify-content-center space-y-4 ${(showbox) ? (author === item.user?.author ? "show-box" : "show-sm") : ""}`}>

                 <Link href={`/profile/${item._id}`}>
                 <li className='update-green read'> 
                 <FontAwesomeIcon icon={faEye} className=''/>
                   <span className='ml-2'>Author</span>
                   </li>
                 </Link>

                    <Link href={`/post/edit/${item._id}`} className={item.user?.author === author ? "" : "d-none"}>
                    <li className='update-green'>
                   <FontAwesomeIcon icon={faPen} />
                    <span className='pl-2'>Edit</span>
                    </li>
                    </Link>

                   <li onClick={() => deleteItem(item._id, item.user.author)} className={author === item.user?.author ? "" : "d-none"}> 
                   <FontAwesomeIcon icon={faTrash} className='text-red-500'/>
                    <span className='ml-2'>Delete</span>
                   </li>
                   </div>

                 <div className={`editonclick d-flex align-items-center justify-center text-xs`}
                 onClick={() => Showbox()}
                 >
                 <FontAwesomeIcon icon={faEllipsisV} className={`single-icon`}/>
                 </div>

              </div>
              </div>
              </div>

        </div>

        <div className='single-parent'>
              <h3 className="my-3 font-semibold popular-title single-title">
                {postData.filter(post => post.category === item.category && post._id !== item._id).length > 0 && 'Related Posts'}
              </h3>
              <div className='flex flex flex-wrap popular-blogs single-blogs-div'>
                {
                 postData.map((val) => {
                    if (val.category === item.category && val._id !== item._id) {
                      return (
                         <Link href = {`/articles/${val._id}`} key = {val._id}className=" position-relative single-div"> <div>
                           <span className="text-xs text-center home-category position-absolute popular-category single-category">
                             {val.category}
                           </span>
                            <Image src={val.image1} alt='' className="single-img2"
                            width='1000' 
                            height='1000'
                            />
                           </div>
                           <div className='position-absolute top-0 pt-24 pl-4 w-100 h-100 single-abs'>
                           <h3 className="my-3 font-semibold popular-title text-white">
                              {val.title}  
                            </h3>
                            <div className="flex align-items-center justify-start space-x-2 text-xs popular-date text-white">
                            <Image src={val.user?.image2 != null ? val.user.image2 : userImg} alt="" className="popular-user-img"
                            width='100' 
                            height='100'
                            />
                            <span className='text-capitalize'>
                            {val.user?.name}
                            </span>
                            <span>
                             {val.date.split('T').at(0)}
                            </span> 
                            </div>
                           </div>
                         </Link>
                      )
                    }
                  })
                }
              </div>
        </div>

    </div>
    <Footer />
    </>
  )
}

export default TokenValidation(Page);
