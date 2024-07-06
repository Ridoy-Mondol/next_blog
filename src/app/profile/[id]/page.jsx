"use client"
import { useState, useEffect } from "react";
import profileImage from "@/app/Images/user_img.jpg";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen,faPlus } from '@fortawesome/free-solid-svg-icons';
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import userImg from "@/app/Images/user_img.jpg";
import { getCookie } from 'cookies-next';
import { toast } from "react-toastify";
import { usePosts } from '@/app/context/postContext';


function Page({params}) {
    const [user, setUser] = useState({});
    const [show, setShow] = useState(false);
    const [showImg, setShowImg] = useState(false);
    const [name, setName] = useState('');
    const [img, setImg] = useState("");
    const [loading2, setLoading2] = useState(true);
    const [loading3, setLoading3] = useState(true); 
    const [isLoading, setIsloading] = useState (false);
    
    const { posts, loading, author, getUser, getSinglePost, singlePost } = usePosts();

    const {id} = params;

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

      
      useEffect(() => {
        if (singlePost?.user?.author) {
          const authorId = singlePost?.user?.author;
          async function fetchData() {
            try {
              const data = await getUser(authorId);
              setUser(data);
              setLoading2(false);
            } catch (error) {
              console.error('Error fetching user:', error);
            }
          }
    
          fetchData();
        }
      }, [singlePost]);

      useEffect(() => {
        setName(user.name || '');
        setLoading3(false);
      }, [user]);

      const updateInfo = async () => {
        try {
          const formData = new FormData();
          if (name) {
            formData.append('name', name);
          }
          // if (img) {
          //   if (img.size > 2000000) {
          //     toast.error("profileImage is too large");
          //   } else {
          //     formData.append('profileImage', img);
          //   }       
          // }
          if (img) {
            formData.append('profileImage', img);
          }
      
          const token = getCookie('token2');
          if (!token) {
            throw new Error("No token found");
          }
      
          const headers = new Headers();
          headers.append('Authorization', `Bearer ${token}`);
      
          if (name.length > 0 || img) {
            setIsloading(true);
      
            try {
              const res = await fetch(`/api/users/profile/${user._id}`, {
                method: 'PATCH',
                headers: headers,
                body: formData,
              });
      
              const res2 = await fetch(`/api/users/blog/${posts.map((post) => post._id)}`, {
                method: 'PATCH',
                headers: headers,
                body: formData,
              });
      
              if (res.status === 200 && res2.status === 200) {
                toast.success("Updated successfully");
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              } else {
                console.error('Error updating name or image:', res.status, res.statusText);
                toast.error("Something went wrong. Please try again");
              }
            } catch (fetchError) {
              console.error('Fetch request error:', fetchError);
              toast.error("Something went wrong. Please try again");
            } finally {
              setIsloading(false);
            }
          }
        } catch (error) {
          console.error('Error in updateInfo function:', error);
          toast.error("Something went wrong. Please try again");
        }
      };
      

      if (loading || loading2 || loading3) {
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
<div className="profile-div">
{isLoading && (
  <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 py-2 px-4 rounded-md shadow-md z-50 flex items-center">
    <div className="spinner spinner-2 mr-2"></div>
    <span className="text-sm font-medium text-white">Processing...</span>
  </div>
)}
<div className="profile-card">
      <div className="profile-image" onClick={() => setShowImg (true)}>
        <Image src={user.profileImage != null ? user.profileImage : profileImage} alt="Profile" 
         width="1000"
         height="1000"
        />
      </div>

      <div className="profile-info">
        <h2 className="text-capitalize">{user.name}
        <FontAwesomeIcon icon={faPen}
        className={`ml-2 ${user._id === author ? "" : "d-none"}`}  onClick={() => setShow(true)}/>
        </h2>
        <p>Total Posts: {posts.filter(post => post.user?.author === user._id).length}</p>
      </div>
    </div>

    <div className={`position-absolute update-name ${(showImg && user._id === author) ? "" : "d-none"}`}>
  <h1> Change Profile Image</h1>
  <input type="file" accept="image/*" className="update-name-input update-img"
  onChange={(e) => setImg (e.target.files[0])}
  />
  <div className="update-name-btn">
  <button className="input-btn save-btn" onClick={updateInfo}>Save</button>
  <button className="input-btn cancel-btn" onClick={() => setShowImg(false)}>Cancel</button>
  </div>
</div>
  

  <div className={`position-absolute update-name ${show ? "" : "d-none"}`}>
  <h1> Change Your Name</h1>
  <input type="text" value={name} autoComplete='off' className="update-name-input"
  onChange={(e) => setName (e.target.value)}
  />
  <div className="update-name-btn">
  <button className="input-btn save-btn" onClick={updateInfo}>Save</button>
  <button className="input-btn cancel-btn" onClick={() => setShow(false)}>Cancel</button>
  </div>
</div>

    <div className='profile-parent'>
              <h3 className="mb-3 pl-0 font-semibold popular-title single-title">
                 All Posts of <span className="text-capitalize">{user.name}</span>
              </h3>
              <div className='flex justify-between flex-wrap gap-8'>
                {
                 posts.map((val) => {
                    if ((val.user.author != null || singlePost.user?.author != null) && val.user?.author === singlePost.user?.author) {
                      return (
                         <Link href = {`/articles/${val._id}`} key = {val._id}className=" position-relative user-post"> <div>
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

                <Link href={`/post`} className="create-btn">
                <div className="plus-icon-div">
                <FontAwesomeIcon icon={faPlus} className="plus-icon"/>
                </div>
                <p>Create Post</p>
                </Link>

              </div>
        </div>

    </div>
    <Footer />
    </>
  )
}

export default Page