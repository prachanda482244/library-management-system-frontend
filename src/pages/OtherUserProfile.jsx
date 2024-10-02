import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOtherUser } from "../config/AxiosInstance";
import toast from "react-hot-toast";

const OtherUserProfile = () => {
  const { userId } = useParams();
  const [userdata, setUserData] = useState({});
  const fetchUserData = async () => {
    try {
      const { data } = await getOtherUser(userId);
      if (data.data) {
        setUserData(data?.data);
        toast.success(data?.message);
      }
    } catch (error) {
      toast.error("Error fetching user data");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
        {/* User Info Section */}
        <div className="flex flex-col items-center md:flex-row md:items-start mb-6">
          <img
            src={userdata?.avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 mb-4 md:mb-0 md:mr-6"
          />
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              {userdata?.username}
            </h2>
            <p className="text-lg text-gray-500 mb-4">{userdata?.email}</p>
            <p className="text-sm text-gray-600 mb-2">
              Role: <span className="font-semibold">{userdata?.role}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Fines: {userdata?.fines ? `$${userdata?.fines}` : "No fines"}
            </p>
            <Link
              to="/chat"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200 ease-in-out focus:outline-none"
            >
              Message {userdata?.username}
            </Link>
          </div>
        </div>

        {/* Book Details Section */}
        {userdata?.borrowedBooksByUser?.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Borrowed Books
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
              {userdata?.borrowedBooksByUser.map((book) => (
                <div
                  key={book._id}
                  className="flex bg-gray-50 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-32 h-auto object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {book.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Author:{" "}
                      <span className="font-semibold">{book.author}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Genre: <span className="font-semibold">{book.genre}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      ISBN: <span className="font-semibold">{book.isbn}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Publication Year:{" "}
                      <span className="font-semibold">
                        {book.publicationYear}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Borrowed At:{" "}
                      <span className="font-semibold">
                        {new Date(book.borrowedAt).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Due Date:{" "}
                      <span className="font-semibold">
                        {new Date(book.dueDate).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Books Borrowed */}
        {userdata?.borrowedBooksByUser?.length === 0 && (
          <p className="text-lg text-gray-600 text-center mt-6">
            No books borrowed.
          </p>
        )}
      </div>
    </div>
  );
};

export default OtherUserProfile;
