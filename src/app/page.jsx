"use client";
import HeroSection from "./components/HeroSection";
import PopularBlogs from "./components/PopularBlogs";
import Editors_pick from "./components/Editors_pick";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
function Home() {
  
  return (
    <div className="home-page">
     <Navbar />
     <div className="">
     <HeroSection />
     <PopularBlogs />
     <Editors_pick />
     </div>
     <Footer />
    </div>

  );
}

export default Home;
