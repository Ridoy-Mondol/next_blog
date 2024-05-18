"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import  Link  from "next/link"
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

function Editors_pick() {
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
}, [token]);
  return (
    <div className="popular-div pt-0">
       <h1 className="home-heading font-bold popular-head my-4">
            Editor’s Pick
        </h1>

    <div className="flex flex-wrap popular-blogs">
    {
      post.map((val,index) => {
      if (index === 1 || index === 3 || index === 2 || index === 7) {
        return (
        <Link href={`/articles/${val._id}`} className="popular-single position-relative" key={val._id}>
          <span className="text-xs text-white text-center home-category position-absolute popular-category">
            {val.category}
          </span>
          <Image src={val.image1} alt="" className="popular-img"
          height="2000"
          width="2000"
          />

          <h3 className="my-3 font-semibold popular-title">
            {val.title}  
          </h3>
          <div className="flex align-items-center justify-start space-x-2 text-xs popular-date">
            <Image src={val.user.profileImage != null ? val.user.profileImage : userImg} alt="" className="popular-user-img"
            height="100"
            width="100"
            />
            <span className="text-capitalize">
              {val.user.name}
            </span>
            <span>
              {val.date.split('T')[0]}
            </span>
          </div>
        </Link>
    );
  }
  return null;
})}

</div> 
</div>
)
}

export default Editors_pick;
