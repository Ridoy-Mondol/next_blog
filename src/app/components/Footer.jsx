import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { GlobeAltIcon } from "@heroicons/react/outline";

const Footer = () => {
  return (
    <footer className="bg-[#222222] py-16 px-10 box-border text-left text-sm text-[#E5E5E5] font-lora">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-20">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white">Contact the Publisher</h3>
          <div className="text-[#E5E5E5]">ridoymondol140@gmail.com</div>
          <div className="text-[#E5E5E5]">+8801319118383</div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white">Explore</h3>
          <Link href="/" className="text-[#E5E5E5] hover:text-[#F86F03]">Home</Link>
          <Link href="/profile" className="text-[#E5E5E5] hover:text-[#F86F03]">Profile</Link>
          <Link href="/articles" className="text-[#E5E5E5] hover:text-[#F86F03]">Articles</Link>
          <Link href="/post" className="text-[#E5E5E5] hover:text-[#F86F03]">Post</Link>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white">Headquarter</h3>
          <div className="text-[#E5E5E5]">Rajshahi, Bangladesh</div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white">Connections</h3>
          <div className="flex gap-4">
            <Link target="_blank" href="https://www.facebook.com/profile.php?id=100015131225530">
            <FontAwesomeIcon icon={faFacebook} className="text-[#E5E5E5] hover:text-[#F86F03]" />
            </Link>
            <Link target="_blank" href="https://www.linkedin.com/in/md-ridoy-mondol-885555297/">
            <FontAwesomeIcon icon={faLinkedin} className="text-[#E5E5E5] hover:text-[#F86F03]" />
            </Link>
            <Link target="_blank" href="https://ridoy-mondol.github.io/portfolio/">
            <GlobeAltIcon className="h-[16px] w-[16px] text-[#E5E5E5] hover:text-[#F86F03] mt-[2px]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
