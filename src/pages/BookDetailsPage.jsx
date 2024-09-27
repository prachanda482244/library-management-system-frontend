import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleBook } from "../config/AxiosInstance"; // Make sure to have this configured
import toast from "react-hot-toast";
import ReviewList from "../components/ReviewList";

const BookDetailsPage = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);

  const getBook = async () => {
    const { data } = await getSingleBook(bookId);
    if (data?.data) {
      setBook(data?.data);
    }
    if (!data?.data) {
      toast.error("Failed to load the book");
    }
  };

  useEffect(() => {
    getBook();
  }, [bookId]);

  if (!book) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 duration-300 ease-in-out">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <img
              src={book.coverImage}
              alt={book.title}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3 md:pl-6">
            <h2 className="text-2xl font-bold text-gray-800">{book.title}</h2>
            <p className="text-gray-600">Author: {book.author}</p>
            <p className="text-gray-600">Genre: {book.genre}</p>
            <p className="text-gray-600">
              Publication Year: {book.publicationYear}
            </p>
            <p className="text-gray-600">ISBN: {book.isbn}</p>
            <p
              className={`text-sm ${
                book.availability ? "text-green-600" : "text-red-600"
              }`}
            >
              {book.availability ? "Available" : "Not Available"}
            </p>
            <div className="mt-4">
              <p className="text-gray-700">
                Borrowed By: {book.borrowedBy.username}
              </p>
              <p className="text-gray-500">
                Due Date: {new Date(book.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Reviews</h3>
        <ReviewList bookId={book._id} />
      </div>
    </div>
  );
};

export default BookDetailsPage;
