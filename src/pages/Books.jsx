import React, { useEffect, useState } from "react";
import { borrowBook, getAllBooks } from "../config/AxiosInstance";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../store/slices/authSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiEye } from "react-icons/hi"; // Import the eye icon from react-icons
import { addToCart } from "../store/slices/cartSlice";

const Books = () => {
  const { userData } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [loadingBookId, setLoadingBookId] = useState(null);

  
  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await getAllBooks();
        if (data?.data) {
          setBooks(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch books", error);
        toast.error("Failed to fetch books");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, [refresh]);


  const handleAddToCart = (book) => {
    dispatch(addToCart(book._id));
    toast.success("Book added to cart");
  };

  const handleBorrowBook = async (bookId) => {
    setLoadingBookId(bookId);
    try {
      const { data } = await borrowBook(bookId);
      if (data.statusCode !== 200) {
        toast.error("Failed to borrow book");
        return;
      }
      toast.success(data.message);
      dispatch(fetchCurrentUser());
      setRefresh(!refresh);
    } catch (error) {
      toast.error("Error borrowing the book");
    } finally {
      setLoadingBookId(null);
    }
  };

  const isBookBorrowedByUser = (bookId) => {
    return userData?.borrowedBooks?.some((book) => book._id === bookId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold animate-pulse">
        Loading books...
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative bg-cover bg-center h-96 rounded-lg shadow-lg overflow-hidden mb-8"
        style={{ backgroundImage: "url('./image-3.jpg')" }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <motion.h1
            className="text-5xl font-bold text-white mb-4 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover, Learn, and Grow
          </motion.h1>
          <motion.p
            className="text-lg text-gray-200 text-center max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Dive into our extensive collection of books across genres. Whether
            you're looking for inspiration, knowledge, or entertainment, we have
            something for everyone. Start your reading journey today!
          </motion.p>
        </div>
      </motion.div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {books && books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className="border border-gray-200 rounded-lg shadow-lg bg-white p-4 transition-transform duration-300 hover:shadow-xl hover:scale-105" // Updated hover effect
            >
              {book.coverImage && (
                <div className="relative">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <Link
                    to={`/books/read/${book._id}`}
                    className="absolute top-2 right-2 text-white bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition"
                    title="View Book"
                  >
                    <HiEye className="w-5 h-5" />
                  </Link>
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-between truncate">
                {book.title}
              
              </h2>
              <p className="text-gray-600 mb-2">
                {book.author ? `Author: ${book.author}` : "No Author"} 
              </p>
                <p className="text-gray-600 mb-2">
                  Rs:{book.price? book.price :'0'}
                </p>
              {/* Borrowed by User */}
              {book.borrowedUserDetails ? (
                <div className="text-sm text-gray-700 mb-4">
                  <p className="font-medium text-yellow-600">
                    Borrowed by: {book.borrowedUserDetails.username}
                  </p>
                  <Link
                    to={`/profile/${book.borrowedUserDetails._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              ) : book.availability ? (
                <p className="text-sm text-green-600 font-medium mb-4">
                  Available for borrowing
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium mb-4">
                  Currently unavailable
                </p>
              )}
 
              {/* Borrow Button or Unavailable Text */}
              {book.availability ? (
                <button
                  className={`w-full ${
                    loadingBookId === book._id
                      ? "bg-gray-500"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white py-2 px-4 rounded-lg transition font-medium`}
                  onClick={() => handleBorrowBook(book._id)}
                  disabled={loadingBookId === book._id}
                >
                  {loadingBookId === book._id
                    ? "Loading..."
                    : "Borrow this Book"}
                </button>
              ) : !isBookBorrowedByUser(book._id)  ? (
                <p className="text-red-500 font-medium text-center">
                  Available at: {formatDueDate(book.dueDate)}
                </p>
              ) : (
                <p className="text-blue-500 font-medium text-center">
                  You requested for this book.
                </p>
              ) ? book.borrowApprovalStatus ==="pending" ?
              <p className="text-yellow-500">
                You requested for this book
              </p>
              :
              <p className="text-green-500">

                You borrowed this book
              </p>
              : null
              }
                <button
                className="border mt-2 w-full capitalize border-purple-900  hover:bg-purple-900 hover:text-white text-black text-sm px-2 py-1 rounded-md"
                onClick={() => handleAddToCart(book)}
              >
                add to cart
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-xl text-gray-500">
            No books available at the moment.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Books;
