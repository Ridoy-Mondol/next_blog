"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getCookie } from 'cookies-next';


async function getProducts(token) {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  try {
    const response = await fetch('/api/users/blog', {
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

export default function HeroSection() {
const [post, setPost] = useState([]);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);
const token = getCookie('token2');

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
  const settings = {
    dots: true,
    dotsClass: "slick-dots-custom",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 5000,
};
  
  return (
  <Slider {...settings}>   
  {post.slice(0, 5).map((item,index) => {
    const truncatedIntroPara = item.blog.substring(0, 150) + '...';
    return (
      <div className="home-container" key={index}>
         <Image src={item.image1} alt="" className="home-bg"
         width="1000"
         height="1000"
         />
         <div className="home-text-div">
          <div className="home-text">
             <p className="text-xs text-white text-center home-category">
              {item.category}
              </p>
             <h1 className="home-heading font-bold">
                 {item.title}
            </h1> 
            <div className="flex text-xs text-gray-300">
             <div className="hero-date mr-3">
               {item.date.split('T')[0]} <FontAwesomeIcon icon={faMinus} className="ml-1"/>
              </div>
              <div>
                {truncatedIntroPara}
              </div>
              </div>
          </div>             
        </div>
      </div>
      )
    })} 
    </Slider>
  );
}
