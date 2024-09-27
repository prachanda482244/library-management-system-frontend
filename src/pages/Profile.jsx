import React, { useEffect, useState } from "react";
import {
  getCurrentUser,
  returnBook,
  updateUser,
  getRecommendations,
} from "../config/AxiosInstance";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../store/slices/authSlice";
import { Link } from "react-router-dom";
import { AiOutlineMessage } from "react-icons/ai";

const Profile = () => {
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
    avatar: "",
    oldPassword: "",
    newPassword: "",
  });

  const getUserProfile = async () => {
    try {
      const { data } = await getCurrentUser();
      setUserProfile(data.data);
      setEditData({
        username: data.data.username,
        email: data.data.email,
        avatar: data.data.avatar,
        oldPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile.");
    }
  };

  const fetchRecommendations = async () => {
    try {
      if (!userProfile) return; // Ensure userProfile is available before fetching recommendations
      const { data } = await getRecommendations(userProfile._id);
      setRecommendations(data.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("Failed to load recommendations.");
    }
  };

  const handleReturnBook = async (id) => {
    try {
      const { data } = await returnBook(id);
      await getUserProfile(); // Fetch the user profile again after returning a book
      toast.success(data.message);
      dispatch(fetchCurrentUser());
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error("Failed to return book.");
    }
  };

  const handleEditSubmit = async () => {
    try {
      await updateUser({
        username: editData.username,
        newPassword: editData.newPassword,
      });
      await getUserProfile(); // Refresh user profile
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  useEffect(() => {
    getUserProfile();
    // No dependency array means this runs on every render.
    return () => {
      // Optional: Cleanup logic if needed, like aborting requests.
    };
  }, []); // Empty dependency array ensures it runs only once on mount

  useEffect(() => {
    fetchRecommendations(); // Fetch recommendations whenever userProfile changes
  }, [userProfile]);

  if (!userProfile) return <div>Loading...</div>;

  const { username, email, avatar, role, borrowedBooks, fines } = userProfile;

  return (
    <div className="container mx-auto p-6">
      {/* User Info Section */}
      <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg p-6 mb-8">
        <img
          src={avatar}
          alt={username}
          className="w-32 h-32 object-cover rounded-full mb-4 md:mb-0 md:mr-6"
        />
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-3xl font-semibold mb-2">{username}</h1>
          <p className="text-gray-600 mb-2">{email}</p>
          <p className="text-gray-500">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </p>
        </div>
        <div className="flex justify-center md:justify-end mt-4 md:mt-0 space-x-2">
          <Link
            to="/chat"
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
          >
            <AiOutlineMessage className="mr-2" /> {/* Message icon */}
            Message
          </Link>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            <FiEdit2 className="mr-2" /> Edit Profile
          </button>
        </div>
      </div>

      {/* Borrowed Books Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Borrowed Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {borrowedBooks.length > 0 ? (
            borrowedBooks.map((book) => (
              <div
                key={book.isbn}
                className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col md:flex-row"
              >
                <div className="flex flex-col items-center md:items-start">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-32 h-48 object-cover rounded-lg shadow-md mb-4"
                  />
                  <button
                    onClick={() => handleReturnBook(book._id)}
                    className="bg-red-500 text-white px-6 py-2 rounded-full shadow hover:bg-red-600 transition duration-300"
                  >
                    Return Book
                  </button>
                </div>
                <div className="flex-grow md:ml-6">
                  <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                  <p className="text-gray-600">Author: {book.author}</p>
                  <p className="text-gray-600">Genre: {book.genre}</p>
                  <p className="text-gray-600">
                    Published: {book.publicationYear}
                  </p>
                  <p className="text-gray-600">ISBN: {book.isbn}</p>
                  <p className="text-gray-600">
                    Borrowed At:{" "}
                    {new Date(book.borrowedAt).toLocaleDateString()}
                  </p>
                  <p className="text-red-500">
                    Due Date: {new Date(book.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No borrowed books at the moment.</p>
          )}
        </div>
      </div>

      {/* Fines Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Fines</h2>
        <p className="text-gray-600">
          {fines === 0 ? "No fines" : `$${fines}`}
        </p>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.length > 0 ? (
            recommendations.map((book) => (
              <div
                key={book._id}
                className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col md:flex-row"
              >
                <div className="flex flex-col items-center md:items-start">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-32 h-48 object-cover rounded-lg shadow-md mb-4"
                  />
                </div>
                <div className="flex-grow md:ml-6">
                  <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                  <p className="text-gray-600">Author: {book.author}</p>
                  <p className="text-gray-600">Genre: {book.genre}</p>
                  <p className="text-gray-600">
                    Suggested For: {book.suggestedFor}{" "}
                    {/* Adjust based on your data */}
                  </p>
                  <button
                    onClick={() => console.log("HEllo world")} // Example action for clicking on a recommendation
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">
              No recommendations available at the moment.
            </p>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <input
              type="text"
              placeholder="Username"
              value={editData.username}
              onChange={(e) =>
                setEditData({ ...editData, username: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            />
            <input
              type="password"
              placeholder="New Password"
              value={editData.newPassword}
              onChange={(e) =>
                setEditData({ ...editData, newPassword: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                <FiX /> Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                <FiCheck /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
