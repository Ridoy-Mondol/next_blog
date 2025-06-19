import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HeroSection(props) {
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
      {props.post.slice(0, 5).map((item, index) => {
        const stripHtmlTags = (htmlString) => {
          const regex = /(<([^>]+)>)/gi;
          return htmlString.replace(regex, "");
        };

        const trimmedAndStrippedBlog = stripHtmlTags(item.blog).trim();

        const truncatedIntroPara =
          trimmedAndStrippedBlog.substring(0, 150) + "...";
        return (
          <div className="home-container" key={index}>
            <Image
              src={item.image1}
              alt=""
              className="home-bg"
              width="1000"
              height="1000"
            />
            <div className="home-text-div">
              <div className="home-text">
                <p className="text-xs text-white text-center home-category">
                  {item.category}
                </p>
                <h1 className="home-heading font-bold">{item.title}</h1>
                <div className="flex text-xs text-gray-300">
                  <div className="hero-date mr-3">
                    {item.date.split("T")[0]}{" "}
                    <FontAwesomeIcon icon={faMinus} className="ml-1" />
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: truncatedIntroPara }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Slider>
  );
}
