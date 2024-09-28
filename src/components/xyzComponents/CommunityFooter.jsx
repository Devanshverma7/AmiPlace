import { GrBug } from "react-icons/gr";
import { MdOutlinePolicy } from "react-icons/md";
import { AiOutlineAudit } from "react-icons/ai";
import { Link } from "react-router-dom";
const CommunityFooter = () => {
  return (
    <div className="Community-footer w-full  md:block sticky md:top-[500px] md:bg-[#f6f6f6] md:opacity-70 bg-white md:rounded-xl md:w-[300px] md:h-[200px] md:py-5 px-3 md:ml-6 border-[0.1px]">
      <div className="footer-links flex md:flex-col text-gray-600 text-base mt-1 md:mt-0">
        <Link
          to="/FeatureBugForm"
          className="footer-link underline hover:text-black flex"
        >
          <GrBug className="mx-2 md:mt-1" />
          <span className="text-xs md:text-base">Feature Request / Bug Report</span>
        </Link>
        <a href="#" className="footer-link underline hover:text-black flex">
          <MdOutlinePolicy className="mx-2 md:mt-1 text-lg" />
          <span className="text-xs md:text-base">Terms of use.</span>
        </a>
        <a
          href="https://s.amizone.net/"
          target={"_blank"}
          className="footer-link underline hover:text-black flex"
        >
          <AiOutlineAudit className="mx-2 md:mt-1 text-black hover:opacity-100 opacity-85 text-lg" />
          <span className="text-xs md:text-base">Amizone</span>
        </a>
      </div>
      <p className="md:mt-3 text-xs md:text-base text-gray-600 flex justify-center">
        <span>Copyright &copy; 2024, Amiplace{" "}</span>
      </p>
    </div>
  );
};
export default CommunityFooter;
