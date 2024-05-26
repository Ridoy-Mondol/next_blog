"use client";
import HeroSection from "./components/HeroSection";
import PopularBlogs from "./components/PopularBlogs";
import Editors_pick from "./components/Editors_pick";
function Home() {
  
  return (
    <div className="home-page">
     <div className="">
     <HeroSection />
     <PopularBlogs />
     <Editors_pick />
     </div>
    </div>

  );
}

export default Home;
