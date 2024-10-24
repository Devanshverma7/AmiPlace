import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa"; // Import search icon

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const userData = useSelector((store) => store.userDetails.userData);

  const fetchUsers = async (term) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    const usersRef = collection(db, "users");
    const endTerm = term + "\uf8ff"; // This Unicode character comes after most UTF-8 characters

    const q = query(
      usersRef,
      where("username", ">=", term),
      where("username", "<=", endTerm),
      orderBy("username"),
      // Limit the results to 10 for performance
      // You can adjust this number based on your needs
      limit(10)
    );

    try {
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setSearchResults([]);
    }
  };

  const debouncedFetchUsers = debounce(fetchUsers, 300);

  useEffect(() => {
    debouncedFetchUsers(searchTerm);
  }, [searchTerm]);
  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus the input when expanding
      setTimeout(() => document.getElementById("search-input").focus(), 100);
    }
  };
  return (
    <div className="relative">
      <div className={`flex items-center ${isExpanded ? 'w-full' : 'w-auto'}`}>
        <button
          onClick={toggleSearch}
          className="p-2 text-xl text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <FaSearch />
        </button>
        <input
          id="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Users..."
          className={` border rounded shadow-md focus:outline-none focus:border focus:border-blue-500 transition-all duration-300 ${
            isExpanded ? 'w-full p-2' : 'w-0 p-0 border-none'
          }`}
        />
      </div>
      {searchResults.length > 0 && (
        <ul className="absolute w-full bg-white border mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((user) => (
            <Link
              to={`${
                userData.username == user.username
                  ? "/profile"
                  : "/DisplayOnlyProfile"
              }`}
              state={{ user: user.username }}
              key={user.id}
              className="p-2 hover:bg-gray-100 flex border-b cursor-pointer space-x-2"
            >
              <img
                src={user.avatarURL}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span className="mt-1">{user.username}</span>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
