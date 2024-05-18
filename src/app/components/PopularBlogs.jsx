"use client"
import { useState, useEffect } from "react";
import Link from "next/link"
import Image from "next/image"
import userImg from "@/app/Images/user_img.jpg"

async function getProducts(token) {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  try {
    const response = await fetch('http://localhost:3000/api/users/blog', {
      method: 'GET',
      headers: headers,
    });
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

function PopularBlogs() {
const [post, setPost] = useState([]);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);

const token = (typeof localStorage !== 'undefined') && localStorage.getItem('token');

useEffect(() => {
  async function fetchData() {
    try {
      const data = await getProducts(token);
      setPost(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching products');
    }
  }

  fetchData();
}, []);

  return (
    <div className="popular-div">
       <h1 className="home-heading font-bold popular-head my-4">
            Popular topics
        </h1>

      <div className="flex flex-wrap popular-blogs">
      {
        post.slice(0,8).map ((val,index) => {
          return (
            <Link href = {`/articles/${val._id}`} className="popular-single position-relative" key={val._id}>
                 <span className="text-xs text-white text-center home-category position-absolute popular-category">
                   {val.category}
                 </span>
                 <Image src={val.image1} alt="" className="popular-img"
                 width="1000"
                 height="1000"
                 />
                 <h3 className="my-3 font-semibold popular-title">
                    {val.title}  
                  </h3>
                  <div className="flex align-items-center justify-start space-x-2 text-xs popular-date">
                    <Image src={val.user.profileImage != null ? val.user.profileImage : userImg} alt="" className="popular-user-img"
                    width="100"
                    height="100"
                    />
                    <span className="text-capitalize">
                      {val.user.name}
                    </span>
                    <span>
                    {val.date.split('T').at(0)}
                    </span> 
                 </div>
              </Link>
          )
        })
      }
      </div> 
    </div>
  )
}

export default PopularBlogs
