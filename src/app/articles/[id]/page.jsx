"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faEllipsisV, faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import userImg from "@/app/Images/user_img.jpg";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getCookie } from 'cookies-next';
import { usePosts } from '@/app/context/postContext';

const determineReadingTime = (length) => {
  if (length >= 500 && length < 1000) {
    return 3;
  } else if (length >= 1000 && length < 1500) {
    return 4;
  } else if (length >= 1500 && length < 2000) {
    return 5;
  } else if (length >= 2000 && length < 2500) {
    return 6;
  } else if (length >= 2500 && length < 3000) {
    return 7;
  } else if (length >= 3000 && length < 3500) {
    return 8;
  } else if (length >= 3500 && length < 4000) {
    return 9;
  } else if (length >= 4000 && length < 4500) {
    return 10;
  } else if (length >= 4500) {
    return 12;
  }
};


function Page({params}) {
  const [showbox, setShowbox] = useState (false);
  const [loading2, setLoading2] = useState(true);

  const {id} = params;
  const { posts, loading, author, deletePost, getSinglePost, singlePost } = usePosts();

  const token = getCookie('token2');

  const Showbox = (_id) => {
    setShowbox(!showbox);
  }


    useEffect(() => {
      async function fetchData() {
        try {
          await getSinglePost(id);
          setLoading2(false);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      }

      fetchData();
    }, [id]);
    
   
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
          deletePost(id);
          window.location.href = '/articles';
        }
        } else {
          console.error('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
    }   
    }
    const stripHtml = (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return (doc.body.textContent || "").replace(/\s+/g, '');
    };
    
    const blogLength = stripHtml(singlePost?.blog).length ?? 'N/A';
    const readingTime = determineReadingTime(blogLength);

    if (loading || loading2) {
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
    <div>
        <Image src = {singlePost?.image1} alt = "" className='w-100 single-img'
        width='1000' 
        height='1000'
        />
        <div>
          <h1 className='home-heading font-bold popular-head my-3 single-title'>
            {singlePost?.title}
          </h1>
          <p className="text-xs text-white text-center home-category single-cate">
            {singlePost?.category}
          </p>

          <div className="flex text-s single-blog">
             <div className='flex space-x-2'>
              <div className='single-date'>{singlePost?.date?.split('T').at(0)}  <FontAwesomeIcon icon={faMinus} className='ml-2'/> </div>
              <div className='flex space-x-1'>
                <span>{readingTime}</span> 
                <span>minutes</span>
              </div>
              </div>
              
              <div className='single-para-parent'>
              <div className='single-para' dangerouslySetInnerHTML={{ __html: singlePost?.blog }} />
              <div className='flex justify-between align-items-center pt-12 pb-16 text-xs'>
                 <Link href = {`/profile/${singlePost?._id}`} className='flex align-items-center space-x-2'>
                    <Image src = {singlePost?.user?.profileImage != null ? singlePost?.user.profileImage : userImg} alt='' className='single-user-img'
                    width='100' 
                    height='100'
                    />
                    <div>
                      <p className='font-bold single-author text-capitalize'>{singlePost?.user?.name}</p>
                    </div>
                 </Link>

                 <div className={`position-absolute list-none editpart2 d-flex flex-column justify-content-center space-y-4 ${(showbox) ? (author === singlePost?.user?.author ? "show-box" : "show-sm") : ""}`}>

                 <Link href={`/profile/${singlePost?._id}`}>
                 <li className='update-green read'> 
                 <FontAwesomeIcon icon={faEye} className=''/>
                   <span className='ml-2'>Author</span>
                   </li>
                 </Link>

                    <Link href={`/post/edit/${singlePost?._id}`} className={singlePost?.user?.author === author ? "" : "d-none"}>
                    <li className='update-green'>
                   <FontAwesomeIcon icon={faPen} />
                    <span className='pl-2'>Edit</span>
                    </li>
                    </Link>

                   <li onClick={() => deleteItem(singlePost?._id, singlePost?.user.author)} className={author === singlePost?.user?.author ? "" : "d-none"}> 
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
                {posts.filter(post => post.category === singlePost?.category && post._id !== singlePost?._id).length > 0 && 'Related Posts'}
              </h3>
              <div className='flex flex flex-wrap popular-blogs single-blogs-div'>
                {
                 posts.map((val) => {
                    if (val.category === singlePost?.category && val._id !== singlePost?._id) {
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
                            <Image src={val.user?.profileImage != null ? val.user.profileImage : userImg} alt="" className="popular-user-img"
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

export default Page;
