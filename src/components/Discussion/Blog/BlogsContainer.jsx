import { useState } from "react";
import BlogList from "./BlogList";
// import CreateBlog from "./createBlog";
// import SeeNewPostsBtn from "./SeeNewPostsBtn";
// import CreateBlogIcon from "./CreateBlogIcon";

const BlogsContainer = () => {
  const [creatBlogBtn, setCreateBlogBtn] = useState(false);

  return (
    <div className="blogContainer sticky top-[-150px] hidden xl:block border-[0.5px] border-gray-300 px-7 pt-5 w-[27%] h-[100%] m-5 rounded-md bg-[#f7f7f7]">
      <h1 className="text-xl font-semibold  mb-2">Blog</h1>
      <BlogList />
      {/* {creatBlogBtn === true ? (
        <CreateBlog setCreateBlogBtn={setCreateBlogBtn} />
      ) : (
        <CreateBlogIcon setCreateBlogBtn={setCreateBlogBtn} />
      )} */}
      {/* <SeeNewPostsBtn /> */}
    </div>
  );
};
export default BlogsContainer;
