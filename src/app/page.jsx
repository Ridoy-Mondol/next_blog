"use client";
import { usePosts } from '@/app/context/postContext';
import Navbar from "@/app/components/Navbar";
import HeroSection from "./components/HeroSection";
import PopularBlogs from "./components/PopularBlogs";
import Editors_pick from "./components/Editors_pick";
import Footer from "@/app/components/Footer";
function Home() {
  const { posts, loading } = usePosts();

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
     <HeroSection post = {posts}/>
     <PopularBlogs post = {posts}/>
     <Editors_pick post = {posts}/>
     </div>
     <Footer />
    </div>

  );
}

export default Home;

