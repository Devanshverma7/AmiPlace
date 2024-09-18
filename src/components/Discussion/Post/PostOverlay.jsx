import FullPost from "./FullPost";
import { IoIosArrowBack } from "react-icons/io";

const PostOverlay = ({
  isOpen,
  onClose,
  postData,
}) => {
  return (
    <>
      {isOpen ? (
        <div className="overlay">
          <div
            className="overlay__background hidden md:block bg-[#0000004a] w-full h-full fixed top-0 left-0 cursor-pointer z-30 "
            onClick={onClose}
          />
          <div className="overlay__container bg-white w-[100vw] h-[100vh] fixed inset-0 md:m-auto z-40  md:w-[42%] md:h-[70%] md:rounded-md overflow-x-hidden overflow-y-auto">
            <div className="overlay__controls sticky top-0 flex justify-between h-fit mt-2 items-center bg-white z-30">
              <span className="full-post-heading ml-5 font-semibold opacity-70 text-blue-600 text-sm bg-blue-50 px-3 rounded-sm">
                @Disscussion
              </span>
              <>
                <button
                  className=" hidden md:closeOverlay md:text-2xl md:cursor-pointer md:inline-block md:after:content-['\00d7'] md:opacity-70 md:mr-4 md:mb-2 md:px-2 md:rounded-full md:hover:bg-gray-200"
                  type="button"
                  onClick={onClose}
                ></button>
                <IoIosArrowBack
                  className="md:hidden mr-3 text-2xl"
                  onClick={onClose}
                />
              </>
            </div>
            <FullPost
              postData={postData}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};
export default PostOverlay;
