import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPostActions } from "../../store/createPostSlice";
import { postsAction } from "../../store/postsSlice";
import { FcDeleteRow } from "react-icons/fc";
import { BsImage } from "react-icons/bs";

const CreatePost = () => {
  const { userData } = useSelector((state) => state.userDetails);
  const postContentInput = useRef();
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(createPostActions.createPost());
  };
  const handlePost = () => {
    const postContent = postContentInput.current.value;
    if (postContent != "") {
      const newPost = {
        postId: -1,
        userImage: userData.imgPath,
        postImage: imageUrl,
        userName: userData.userName,
        yearInfo: userData.yearInfo,
        content: postContent,
        likes: 0,
      };
      dispatch(postsAction.addPost(newPost));
      dispatch(createPostActions.createPost());
    } else {
      alert("Please add content in your post");
    }
  };
  return (
    <div className="createPostContainer border-[1px] border-gray-300 rounded-lg   p-2 m-3">
      <div className="create-a-post flex justify-center items-center h-10 border-b-[1px]">
        <h1 className="text-xl font-semibold mb-2">Create a post</h1>
      </div>
      <div className="userInfo border-b-[1px]">
        {/* <p className="text-sm opacity-80 ml-3 my-3">
          Create a post, others will see when you post
        </p> */}
        <div className="flex space-x-2 my-1">
          <img
            className="rounded-full w-8 border-[2px] border-green-600"
            src="src/Media/images/my_img.jpeg"
          />
          <span className="font-medium mt-1">devanshVerma</span>
        </div>
      </div>
      <textarea
        ref={postContentInput}
        rows="10"
        className="h-52 px-2 w-[100%] resize-none mt-3 focus:outline-none"
        placeholder="Share your experience or ask from others."
        autofocus
      ></textarea>
      <div className="flex justify-between">
        <label
          htmlFor="imageInput"
          className="text-2xl ml-5 opacity-60 cursor-pointer"
        >
          <BsImage />
        </label>
        <input
          id="imageInput"
          type="file"
          onChange={handleFileChange}
          accept=".jpeg,.png,.jpg,.raw,.gif"
          className="hidden"
        />
        <div className="submitPost flex space-x-4">
          <button
            className="py-1 px-3 bg-[#000000a6] text-white font-medium rounded-md"
            onClick={handlePost}
          >
            Post
          </button>
          <FcDeleteRow className="text-3xl" onClick={handleDelete} />
        </div>
      </div>
    </div>
  );
};
export default CreatePost;
