import { useState } from "react";
import { useSelector } from "react-redux";
import CommunityFooter from "../../xyzComponents/CommunityFooter";
import CreatePost from "./CreatePost";
import CreatePostIcon from "./CreatePostIcon";
import PostsList from "./PostsList";
const PostListContainer = () => {
  const { create } = useSelector((store) => store.createPost);
  const [toggle, setToggle] = useState(false);
  const postsReload = () => {
    setToggle(!toggle);
  };
  return (
    <div className="postListContainer w-full mx-3 md:ml-5 md:mr-0 xl:mx-0 lg:max-w-[729px] rounded-t-md h-[100%] lg:border-[1px] border-x-[1px] border-b-[1px] border-gray-300 md:mt-10">
      {create == false ? <CreatePostIcon /> : <CreatePost postsReload={postsReload}/>}
      <PostsList toggle={toggle}/>
      <div className="md:hidden z-50 sticky bottom-0">
        <CommunityFooter />
      </div>
    </div>
  );
};
export default PostListContainer;
