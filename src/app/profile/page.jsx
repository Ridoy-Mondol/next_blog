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


async function getUser(authorId) {
  try {
    const response = await fetch(`http://localhost:3000/api/users/profile/${authorId}`);
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


function Page() {
    const [postData, setPostData] = useState([]);
    const [user, setUser] = useState({});
    const [author, setAuthor] = useState('');
    const [show, setShow] = useState(false);
    const [showImg, setShowImg] = useState(false);
    const [name, setName] = useState('');
    const [img, setImg] = useState("");
    const [postNum, setPostNum] = useState(0);


    const token = getCookie('token2');

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
            setAuthor(data.userId);
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
            const data = await getAllProducts(token);
            setPostData(data);
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        }
      
        fetchData();
      }, [token]);
      
      useEffect(() => {
        async function fetchData() {
          try {
            const data = await getUser(author);
            setUser(data);
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        }
      
        fetchData();
      }, [author]);

      useEffect(() => {
        setName(user.name || '');
      }, [user]);

      const updateInfo = async () => {
        const formData = new FormData();
        name && formData.append('name', name);
        img && formData.append('profileImage', img);

        const token = getCookie('token2');
        const headers = new Headers();
         headers.append('Authorization', `Bearer ${token}`);
        if (name.length > 0 || img) {
        try {
          const res = await fetch(`/api/users/profile/${author}`, {
            method: 'PATCH',
            headers: headers,
            body: formData,
          });
          const res2 = await fetch(`/api/users/blog/${postData.map((post) => post._id)}`, {
            method: 'PATCH',
            headers: headers,
            body: formData,
          });


          if (res.status === 200 || res2.status === 200) {
            window.location.href = '/profile';
          } else {
            console.error('Error updating name:', res.status, res.statusText);
          }
        } catch (error) {
          console.error('Error updating name:', error);
        }
      }
      }


return (
<>
<Navbar />
<div className="profile-div position-relative">
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
        className="ml-2" onClick={() => setShow(true)}/>
        </h2>
        <p>Total Posts: {postData.filter(post => post.user?.author === author).length}</p>
      </div>
    </div>

  <div className={`position-absolute update-name ${showImg ? "" : "d-none"}`}>
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
  <input type="text" value={name} className="update-name-input"
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
                 postData.map((val) => {
                    if (val.user.author === author) {
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
