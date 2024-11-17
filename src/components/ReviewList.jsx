import { useEffect, useState } from "react";
import {
  fetchReview,
  postReview,
  deleteReview,
  editReview,
} from "../config/AxiosInstance";
import Review from "./Review";
import { FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ReviewList = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const reviewsPerPage = 6;
  const { userData } = useSelector((state) => state.user);
  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleSubmitReply = async () => {
    if (!newReply.trim()) return;

    try {
      const { data } = await postReview({
        bookId,
        content: newReply,
        parentReviewId: null,
      });
      if (data?.data) {
        toast.success("Review added successfully");
        setNewReply("");
        setRefresh(!refresh);
      } else {
        toast.error("Failed to add review");
      }
    } catch (error) {
      toast.error("Error adding review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const { data } = await deleteReview(reviewId);
      if (data?.success) {
        toast.success("Review deleted successfully");
        setRefresh(!refresh);
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      toast.error("Error deleting review");
    }
  };

  const handleEditReview = async (reviewId, updatedContent) => {
    try {
      const { data } = await editReview(reviewId, { content: updatedContent });
      if (data?.success) {
        toast.success("Review updated successfully");
        setRefresh(!refresh);
      } else {
        toast.error("Failed to update review");
      }
    } catch (error) {
      toast.error("Error updating review");
    }
  };

  const getReviews = async () => {
    try {
      const { data } = await fetchReview({
        bookId,
        page: currentPage,
        limit: reviewsPerPage,
      });
      setTotalReviews(data?.data?.totalCount || 0);
      setTotalPages(data?.data?.totalPages || 1);
      setReviews(data?.data?.reviews || []);
    } catch (error) {
      console.error(error);
      toast.error("Error loading reviews");
    }
  };

  useEffect(() => {
    getReviews();
  }, [bookId, refresh, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmitReply();
    }
  };

  return (
    <div>
      {/* Add a new review section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Add a Review</h2>
        <div className="flex mt-2">
          {userData?.avatar && (
            <img
              src={userData?.avatar}
              alt="User profile"
              className="w-10 h-10 rounded-full mr-2"
            />
          )}
          <input
            type="text"
            value={newReply}
            onChange={handleReplyChange}
            onKeyDown={handleKeyDown}
            placeholder="Write a review..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            onClick={handleSubmitReply}
            className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>

      {/* Section for user reviews */}
      <h2 className="text-lg font-semibold mb-2">
        User Reviews ({reviews.length})
      </h2>

      {reviews.length > 0 ? (
        <Review reviews={reviews} bookId={bookId} />
      ) : (
        <p>No reviews yet.</p>
      )}

      {/* Pagination Controls */}
      {totalReviews > reviewsPerPage && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
