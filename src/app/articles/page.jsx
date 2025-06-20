"use client";
import React, { useState } from "react";
import img from "@/app/Images/goldenleaf.jpg";
import userImg from "@/app/Images/user_img.jpg";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faPen,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { usePosts } from "@/app/context/postContext";
import { getCookie } from "cookies-next";

function Page() {
  const [showbox, setShowbox] = useState(false);
  const [id, setId] = useState(null);

  const { posts, loading, author, deletePost } = usePosts();

  const token = getCookie("token2");

  const Showbox = (_id) => {
    setId(_id);
    setShowbox(!showbox);
  };

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  async function deleteItem(id, author) {
    try {
      const response = await fetch(`/api/users/blog/${id}`, {
        method: "DELETE",
        headers: headers,
      });
      const data = await response.json();
      if (data.success === true) {
        if (data.userId === author) deletePost(id);
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState("All");
  const categoryHeadings = {
    All: "All Blogs",
    Adventure: "Adventure",
    Travel: "Travel",
    Sports: "Sports",
    Technology: "Technology",
    Branding: "Branding",
  };

  let filteredItems = [...posts].reverse().filter((item) => {
    if (currentCategory === "All") {
      return true;
    } else {
      return item.category === currentCategory;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    setCurrentPage(1);
  };

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
    <>
      <Navbar />
      <div className="position-relative article-div">
        <Image
          placeholder="blur"
          src={img}
          alt=""
          className="w-100 article-img"
        />
        <div className="position-absolute w-100 top-0 y  pt-28">
          <h1 className="blog-heading">Join Us on a Journey Through Ideas</h1>
          <p className="blog-para">
            Welcome to our dynamic community of writers and readers. Dive into a
            world of diverse perspectives, insights, and discussions. Explore
            topics ranging from technology to arts, and beyond.{" "}
            <span className="hide-mobile">
              Share your thoughts, learn something new, and engage in meaningful
              conversations. Together, let&apos;s cultivate knowledge and foster
              connections through our blog
            </span>
          </p>
        </div>

        <div className="py-16">
          <h1 className="home-heading font-bold popular-head blog-head">
            {categoryHeadings[currentCategory]}
          </h1>
          <div className="flex list-none text-xs popular-list blog-head">
            <li>
              <button
                type="button"
                className={`popular-link ${
                  currentCategory === "All" ? "active" : ""
                }`}
                onClick={() => handleCategoryClick("All")}
              >
                All
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`popular-link ${
                  currentCategory === "Adventure" ? "active" : ""
                }`}
                onClick={() => handleCategoryClick("Adventure")}
              >
                Adventure
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`popular-link ${
                  currentCategory === "Travel" ? "active" : ""
                }`}
                onClick={() => handleCategoryClick("Travel")}
              >
                Travel
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`popular-link ${
                  currentCategory === "Sports" ? "active" : ""
                }`}
                onClick={() => handleCategoryClick("Sports")}
              >
                Sports
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`popular-link ${
                  currentCategory === "Technology" ? "active" : ""
                }`}
                onClick={() => handleCategoryClick("Technology")}
              >
                Technology
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`popular-link ${
                  currentCategory === "Branding" ? "active" : ""
                }`}
                onClick={() => handleCategoryClick("Branding")}
              >
                Branding
              </button>
            </li>
          </div>
          <div className="">
            {currentItems.map((val) => {
              const stripHtmlTags = (htmlString) => {
                const regex = /(<([^>]+)>)/gi;
                return htmlString.replace(regex, "");
              };

              const trimmedAndStrippedBlog = stripHtmlTags(val.blog).trim();

              const truncatedIntroPara =
                trimmedAndStrippedBlog.substring(0, 350) + "...";
              const truncatedIntroPara2 =
                trimmedAndStrippedBlog.substring(0, 120) + "...";

              return (
                <div className="flex blog-div my-8" key={val._id}>
                  <Link href={`/articles/${val._id}`} className="blog-img-div">
                    <Image
                      src={val.image1}
                      alt=""
                      className="blog-img"
                      width="1000"
                      height="1000"
                    />
                  </Link>
                  <div className="blog-para-div">
                    <div className="d-flex justify-between align-items-start position-relative">
                      <h1 className="font-bold blog-title">{val.title}</h1>

                      <div
                        className={`position-absolute list-none editpart d-flex flex-column justify-content-center space-y-3 ${
                          showbox && id === val._id
                            ? author === val.user.author
                              ? "show-box"
                              : "show-sm"
                            : ""
                        }`}
                      >
                        <Link href={`/profile/${val._id}`}>
                          <li className="update-green read">
                            <FontAwesomeIcon icon={faEye} className="" />
                            <span className="ml-2">Author</span>
                          </li>
                        </Link>

                        <Link
                          href={`/post/edit/${val._id}`}
                          className={author === val.user.author ? "" : "d-none"}
                        >
                          <li className="update-green">
                            <FontAwesomeIcon icon={faPen} />
                            <span className="pl-2">Edit</span>
                          </li>
                        </Link>

                        <li
                          onClick={() => deleteItem(val._id, val.user.author)}
                          className={author === val.user.author ? "" : "d-none"}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-red-500"
                          />
                          <span className="ml-2">Delete</span>
                        </li>
                      </div>

                      <div
                        className={`editonclick d-flex align-items-center justify-center`}
                        onClick={() => Showbox(val._id)}
                      >
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </div>
                    </div>

                    <div className="flex align-items-center space-x-2 my-3">
                      <Image
                        src={
                          val.user.profileImage != null
                            ? val.user.profileImage
                            : userImg
                        }
                        alt=""
                        className="single-user-img"
                        width="100"
                        height="100"
                      />
                      <div>
                        <p className="font-bold single-author text-capitalize">
                          {val.user.name}
                        </p>
                        <p className="author-profession">
                          {val.date.split("T").at(0)}
                        </p>
                      </div>
                    </div>
                    <p className="blog-para-2 mb-4">
                      <span
                        className="hide-mobile"
                        dangerouslySetInnerHTML={{ __html: truncatedIntroPara }}
                      />
                      <span
                        className="hide-desktop"
                        dangerouslySetInnerHTML={{
                          __html: truncatedIntroPara2,
                        }}
                      />
                    </p>
                    <Link
                      href={{ pathname: `/articles/${val._id}` }}
                      className="blog-btn"
                    >
                      Read full article...
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={currentPage === i + 1 ? "active" : ""}>
                  <Link href="#" onClick={() => paginate(i + 1)}>
                    {i + 1}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Page;
