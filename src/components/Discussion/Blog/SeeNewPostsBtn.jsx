import { getDocs, collection, orderBy, query } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { db } from "../../../firebase.config";
import { postsAction } from "../../../store/postsSlice";
import { FaChevronUp } from "react-icons/fa";
import { useState } from "react";
const NewPostBtn = () => {
  const dispatch = useDispatch();
  const [seePostMsg, setSeePostMsg] = useState(false);

  const fetchNewPost = async () => {
    const reloadPost = [];
    try {
      const postQuery = query(
        collection(db, "post"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(postQuery);
      querySnapshot.forEach((post) => {
        reloadPost.push({ ...post.data(), id: post.id }); // Include the document ID
      });
      dispatch(postsAction.addPost(reloadPost));
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="justify-center items-center w-full mb-[-45px]">
      <button
        type="button"
        className="bg-gray-400 w-fit flex py-2 px-3 rounded-md text-sm text-white hover:bg-gray-600"
        onClick={fetchNewPost}
        onMouseEnter={() => setSeePostMsg(true)}
        onMouseOut={() => setSeePostMsg(false)}
      >
        See new posts <FaChevronUp className="mt-1 ml-1" />
      </button>
      <p className={`${!seePostMsg && "hidden"} text-xs opacity-60`}>
        new post will be fetched only if new posts are added{" "}
      </p>
    </div>
  );
};
export default NewPostBtn;
