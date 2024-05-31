"use client";
import { useState, useEffect } from 'react';
import getProducts from '@/app/components/getProducts';
import Navbar from "@/app/components/Navbar";
import HeroSection from "./components/HeroSection";
import PopularBlogs from "./components/PopularBlogs";
import Editors_pick from "./components/Editors_pick";
import Footer from "@/app/components/Footer";
import { getCookie } from 'cookies-next';
function Home() {
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

if (loading) {
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
    <div className="home-page">
      <Navbar />
     <div className="">
     <HeroSection post = {post}/>
     <PopularBlogs post = {post}/>
     <Editors_pick post = {post}/>
     </div>
     <Footer />
    </div>

  );
}

export default Home;
